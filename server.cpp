#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <ws.h>
#include <iostream>
#include <time.h>

#include "tiktaktoe.cpp"

using namespace std;

typedef enum
{
    WAITING_PLAYERS = 0,
    WAITING_MOVE = 1
} state;

ws_cli_conn_t *clients[2];
int target;

state game_state = WAITING_PLAYERS;

TikTakToe game;

int connexions = 0; 

void onopen(ws_cli_conn_t *client)
{
    char *cli;
    cli = ws_getaddress(client);
    printf("Connection opened, addr: %s\n", cli);
    if (connexions < 2)
    {
        clients[connexions] = client;
        string s = "ID"; s += (connexions + '0');
        ws_sendframe_txt(client, s.c_str());
        printf("connexion: %i\tstate: %i\n", connexions, game_state);
        if (game_state == WAITING_PLAYERS && connexions == 1)
        {
            target = rand() % 2;
            printf("target: %i\n", target);
            ws_sendframe_txt(clients[target], "FIRST");
            ws_sendframe_txt(clients[!target], "SECOND"); 
            game_state = WAITING_MOVE;   
        }
    }
    else 
    {
        cout << "Too many clients connected to the server!" << endl;
    }
    connexions += 1;
}

void onclose(ws_cli_conn_t *client)
{
    char *cli;
    cli = ws_getaddress(client);
    printf("Connection closed, addr: %s\n", cli);
    connexions -= 1;
    if (client == clients[0])
    {
        clients[0] = clients[1];
        ws_sendframe_txt(clients[0], "DISCON");
        clients[1] = NULL;
    }
}

void onmessage(ws_cli_conn_t *client, const unsigned char *msg, uint64_t size, int type)
{
    (void) type;
    char *cli;
    cli = ws_getaddress(client);
    
    
    //printf("I receive a message: %s (%llu), from: %s\n", msg, size, cli);
    if (game_state == WAITING_MOVE)
    {
        if (client == clients[target])
        {
            printf ("MOVE : %s\n", msg);
            if (!game.move((const char*)msg))
            {
                ws_sendframe_txt(clients[target], "ILLEGAL");
                return ;
            }
            ws_sendframe_txt(clients[target], "OK");
            if (game.win())
            {
                ws_sendframe_txt(clients[target], "WINNER");
                ws_sendframe_txt(clients[!target], "LOOSER");
                game.getCurrentPlayer()->score += 1;
                string s = "SCORE"; 
                s += to_string(game.players[game.currentPlayer].score);
                s += "-";
                s += to_string(game.players[game.currentPlayer].score);

                ws_sendframe_txt(clients[target], s.c_str());
                ws_sendframe_txt(clients[!target], s.c_str());
            }
            else 
            {
                ws_sendframe_txt(clients[!target], (const char*)msg);
                target = !target;
                game.currentPlayer = !game.currentPlayer;
            }
        }
        else
        {
            cout << "Protocol watning, wrong client reply." << endl;
        }
    }
}

int main(void)
{
    srand(time(0));

    struct ws_events evs;
    evs.onopen    = &onopen;
    evs.onclose   = &onclose;
    evs.onmessage = &onmessage;
    ws_socket(&evs, 8080, 0, 1000);
    return (0);
}