
#pragma once
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <ws.h>
#include <iostream>
#include <time.h>
#include <string.h>
#include <memory>
#include <map>

using namespace std;

#include "board_game.hpp"

#ifndef GAME_TYPE
# define GAME_TYPE BoardGame
#endif

char *get_packet(const unsigned char *msg, const char *type)
{
    if (!strncmp((char *)msg, type, strlen(type)))
        return (char *)msg + strlen(type);
    return 0;
}

class SocketPlayer;

map <ws_cli_conn_t*, SocketPlayer> clients;

class SocketPlayer
{
    public:
    char *name = 0;
    shared_ptr<GAME_TYPE> game = 0;
    int gamePlayerIndex = 0;
    SocketPlayer *opponent = 0;
    ws_cli_conn_t *conn = 0;

    void sendNames()
    {
        auto str = "PSEUDO" + to_string(gamePlayerIndex) +"-" + string(name);
        ws_sendframe_txt(conn, str.c_str());
        str = "PSEUDO" +to_string(!gamePlayerIndex) + "-" + string(opponent && opponent->name ? opponent->name : "");
        ws_sendframe_txt(conn, str.c_str());
    }

    void sendScores()
    { 
        auto str = "SCORE" +to_string(gamePlayerIndex) +"-" + to_string(game->players[gamePlayerIndex].score);
        ws_sendframe_txt(conn, str.c_str());
        str = "SCORE" + to_string(!gamePlayerIndex) +"-" + to_string(opponent ? game->players[opponent->gamePlayerIndex].score : 0);
        ws_sendframe_txt(conn, str.c_str()); 
    }

    void sendMove(int x, int y, char c)
    {
        (void) c;
        string packet = string("MOVE") + to_string(game->currentPlayerIndex) + "-" + to_string(y + 1) + "-" + to_string(x + 1);
        ws_sendframe_txt(conn, packet.c_str());
    }

    void sendCurrent()
    {
        if (gamePlayerIndex == game->currentPlayerIndex)
            ws_sendframe_txt(conn, string("CURRENT" + to_string(gamePlayerIndex)).c_str());
        else 
            ws_sendframe_txt(conn, string("CURRENT" + to_string(!gamePlayerIndex)).c_str());
    }

    void setOpponent(SocketPlayer *new_opponent)
    {
        // check if opponent is not playing with someone already
        if (new_opponent->game->bothPlayerConnected)
            return ;
        // set previous opponent in a new room if any
        if (opponent && opponent != new_opponent)
        {
            opponent->gamePlayerIndex = 0;
            opponent->game->handleDiscon(gamePlayerIndex);
            opponent->game = shared_ptr<GAME_TYPE>(new GAME_TYPE());
            opponent->game->bothPlayerConnected = 0;
            opponent->opponent = 0;
            opponent->sendNames();
            opponent->sendScores();
        }        
        // set new opponent 
        opponent = new_opponent;
        opponent->opponent = this;
        gamePlayerIndex = 0;
        opponent->game->handleDiscon(opponent->gamePlayerIndex);
        opponent->gamePlayerIndex = 1;
        opponent->game = game;
        game->bothPlayerConnected = true;
        game->start();
        sendNames();
        sendScores();
        sendCurrent();
        opponent->sendNames();
        opponent->sendScores();
        opponent->sendCurrent();
    }
};




SocketPlayer* findByName(char *name)
{
    for (auto it = clients.begin(); it != clients.end(); ++it)
    {
        if (it->second.name && !strcmp(it->second.name, name))
            return &(it->second);
    }    
    return 0;
}

void onopen(ws_cli_conn_t *client)
{
    char *addr;

    addr = ws_getaddress(client);
    printf("Client connected :\t%s [%p]\n", addr, client);

    clients[client].name = 0;
    clients[client].game = 0;
    clients[client].gamePlayerIndex = 0; 
}

void onclose(ws_cli_conn_t *client)
{
    char *addr;
 
    addr = ws_getaddress(client);
    printf("Client disconnected :\t%s [%p]\n", addr, client);
    free(clients[client].name);
    if (clients[client].game)
    {
        clients[client].game->bothPlayerConnected = false; 
        clients[client].game->handleDiscon(clients[client].gamePlayerIndex);
        if (clients[client].opponent)
        {
            clients[client].opponent->opponent = 0;
            clients[client].opponent->sendNames();
            clients[client].opponent->sendScores();
        }
    }
    clients.erase(client);    
}

void onmessage(ws_cli_conn_t *client, const unsigned char *msg, uint64_t size, int type)
{
    (void)size;
    (void)type;
    char *addr;
    addr = ws_getaddress(client);
    if (strcmp("ROOMS", (char*)msg))
        printf("Client message :\t%s [%p] [%s]\n", addr, client, (const char *)msg);
    char *packet_data;
    if ((packet_data = get_packet(msg, "NAME")))
    {
        if (findByName(packet_data) || !strlen(packet_data))
        {
            ws_sendframe_txt(client, "NAME_IN_USE");
            return ;   
        }
        clients[client].name = strdup(packet_data);
        clients[client].game = shared_ptr<GAME_TYPE>(new GAME_TYPE());
        clients[client].game->bothPlayerConnected = false; 
        clients[client].gamePlayerIndex = 0;
        clients[client].opponent = 0;
        clients[client].conn = client;
        printf("\t- NAME (%s)\n", packet_data);
        ws_sendframe_txt(client, "NAME_ACK");
    }
    else if ((packet_data = get_packet(msg, "ROOMS")))
    {
        string rooms = "";
      
        rooms.append("ROOM-");
        rooms.append("\n");
      
        // for each players

       // printf("\n\n");
        for (auto it = clients.begin(); it != clients.end(); ++it)
        {
            // dont show :  current client in rooms, non-logged in users, currently playing users

           // printf("testing .... %s ", it->second.name);

            if (it->first == client || !it->second.game || it->second.game->bothPlayerConnected)
            {
           //     printf("KO : %p %i\n", it->second.game.get(), it->second.game ? it->second.game->bothPlayerConnected : 0);
                continue ;
            }
         //   printf("OK\n");
            rooms.append("ROOM-");
            rooms.append(it->second.name);
            rooms.append("\n");
        }
        ws_sendframe_txt(client, rooms.c_str());
    }
    else if ((packet_data = get_packet(msg, "OPPONENT")))
    {
        auto opponent = findByName(packet_data);
        if (!opponent)
            return ;
        clients[client].setOpponent(opponent);
        
    }
    else if ((packet_data = get_packet(msg, "MOVE")))
    {
        int y;
        int x;
        game_state s;

        if (clients[client].game->locked)
            return;
        if (sscanf(packet_data, "%i-%i", &y, &x) != 2)
            return ;
        y -= 1;
        x -= 1;
        if (x < 0 || y < 0)
            return ;
        if (clients[client].game->currentPlayerIndex != clients[client].gamePlayerIndex)
        {
            ws_sendframe_txt(client, "NOT_YOU");
            return ;
        }
        s = clients[client].game->handleMove(x, y, '-');
        if (s == ILLEGAL_MOVE)
        {
             ws_sendframe_txt(client, "ILLEGAL");     
            return ;
        }
        // send move :: 
        clients[client].sendMove(x, y, '-');
        clients[client].sendCurrent();

        clients[client].opponent->sendMove(x, y, '-');
        clients[client].opponent->sendCurrent(); 
        
        if (s == EQUAL) 
        {
            clients[client].sendScores();
            ws_sendframe_txt(client, "EQUAL");
            ws_sendframe_txt(clients[client].opponent->conn, "EQUAL");
        }
        else if (s == PLAYER_1_WIN || s == PLAYER_2_WIN)
        {
            clients[client].sendScores();
            clients[client].opponent->sendScores();

            ws_sendframe_txt(client, "WINNER");
            ws_sendframe_txt(clients[client].opponent->conn, "LOOSER");
        }
        else if (s == IN_PROGRESS)
        {

        }
        else 
        {
            printf ("ERROR : unknow game_state %x\n", s);
        }
    }
    else if (get_packet(msg, "NEW"))
    {
        if (!clients[client].opponent)
            return ;
        clients[client].game->start();
        ws_sendframe_txt(client, "CLEAR");
        ws_sendframe_txt(clients[client].opponent->conn, "CLEAR"); 
        clients[client].sendCurrent();
        clients[client].opponent->sendCurrent();
    }
    else if ((packet_data = get_packet(msg, "MSG")))
    {
        if (clients[client].name)
            ws_sendframe_txt(client, (string("MSG") + clients[client].name + '-' + packet_data).c_str());
        if (clients[client].opponent && clients[client].name)
            ws_sendframe_txt(clients[client].opponent->conn, (string("MSG") + clients[client].name + '-' + packet_data).c_str());
    }
}

