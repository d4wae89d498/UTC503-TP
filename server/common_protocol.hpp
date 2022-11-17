
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
        auto str = "PSEUDO0-" + string(name);
        ws_sendframe_txt(conn, str.c_str());
        str = "PSEUDO1-" + string(opponent && opponent->name ? opponent->name : "");
        ws_sendframe_txt(conn, str.c_str());
    }

    void sendScores()
    { 
        auto str = "SCORE0-" + to_string(game->players[gamePlayerIndex].score);
        ws_sendframe_txt(conn, str.c_str());
        str = "SCORE1-" + to_string(opponent ? game->players[opponent->gamePlayerIndex].score : 0);
        ws_sendframe_txt(conn, str.c_str()); 
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
        opponent->sendNames();
        opponent->sendScores();
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

        clients[client].setOpponent(opponent);
        
    }
    //else if (packet_data = )
   
}

