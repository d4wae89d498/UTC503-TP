#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <ws.h>
#include <iostream>
#include <time.h>

#include "tiktaktoe.cpp"

#define PORT 8080

#include <map>
using namespace std;

map<void *, shared_ptr<TikTakToe> > games;

char *get_packet(const unsigned char *msg, char *type)
{
    if (!strncmp((char *)msg, type, strlen(type)))
        return (char *)msg + strlen(type);
    return 0;
}

void onopen(ws_cli_conn_t *client)
{
    char *addr;
    addr = ws_getaddress(client);
    printf("Client connected : %s[%p]\n", addr, client);
    games[client] = shared_ptr<TikTakToe>(new TikTakToe());
}

void send_score(void *client)
{
    int i = 0;
    while (i < 2)
    {

        int y = 0;
        while (y < 2)
        {
            char *msg3 = 0;
            asprintf(&msg3, "SCORE%i-%i", y, games[client]->players[y].score);
            ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[i].addr, msg3);
            y += 1;
            free(msg3);
        }
        i += 1;
    }
}

void onclose(ws_cli_conn_t *client)
{
    char *addr;
    addr = ws_getaddress(client);
    printf("Client disconnected : %s[%p]\n", addr, client);
}

void onmessage(ws_cli_conn_t *client, const unsigned char *msg, uint64_t size, int type)
{
    (void)type;
    char *addr;
    addr = ws_getaddress(client);
    printf("Client message : %s[%p] -> %s\n", addr, client, (const char *)msg);
    char *packet_data;
    if ((packet_data = get_packet(msg, "NAME")))
    {
        games[client]->players[0].name = strdup(packet_data);
        games[client]->players[0].addr = client;
        printf("New name '%s'\n", strdup(games[client]->players[0].name));
    }
    else if ((packet_data = get_packet(msg, "OPPONENT")))
    {
        // dont allow same player twice
        if (!strcmp(packet_data, games[client]->players[0].name))
        {
            ws_sendframe_txt(client, "OPPONENT_NOT_FOUND");
            return;
        }
        for (auto it = games.begin(); it != games.end(); ++it)
        {
            if (it->second->players[0].name && !strcmp(it->second->players[0].name, packet_data))
            {
                // send leave ??

                it->second->players[1].name = strdup(games[client]->players[0].name);
                games[client] = it->second;
                it->second->players[1].addr = client;

                printf("NEW MATCH: %s vs %s\n", it->second->players[0].name, it->second->players[1].name);

                // TODO :: initalize a new player ::

                int start = rand() % 2;
                games[client]->currentPlayer = start;
                games[client]->clear();
                int i = 0;
                while (i < 2)
                {
                    ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[i].addr, "CLEAR");
                    int y = 0;
                    while (y < 2)
                    {
                        char *msg3;
                        asprintf(&msg3, "PSEUDO%i-%s (%c)", y, games[client]->players[y].name, y ? 'x' : 'o');
                        ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[i].addr, msg3);
                        free(msg3);

                        asprintf(&msg3, "SCORE%i-%i", y, games[client]->players[y].score);
                        ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[i].addr, msg3);
                        y += 1;
                        free(msg3);
                    }

                    char *msg2;
                    asprintf(&msg2, "CURRENT%i", start);

                    ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[i].addr, msg2);
                    free(msg2);

                    i += 1;
                }
                return;
            }
        }
        ws_sendframe_txt(client, "OPPONENT_NOT_FOUND");
    }
    else if ((packet_data = get_packet(msg, "MOVE")))
    {
        if (client == games[client]->players[games[client]->currentPlayer].addr)
        {
            if (!games[client]->move(packet_data))
            {
                printf("%s\n", packet_data);
                ws_sendframe_txt(client, "ILLEGAL");
                return;
            }
            char *s;
            asprintf(&s, "MOVE%i-%s", games[client]->currentPlayer, packet_data);
            ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[0].addr, s);
            ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[1].addr, s);
            free(s);

            if (games[client]->win())
            {
                ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[games[client]->currentPlayer].addr, "WINNER");
                ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[!games[client]->currentPlayer].addr, "LOOSER");
                send_score(client);
                return;
            }
            else if (games[client]->equal())
            {
                ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[games[client]->currentPlayer].addr, "EQUAL");
                ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[!games[client]->currentPlayer].addr, "EQUAL");
                send_score(client);
                return;
            }

            games[client]->currentPlayer ^= 1;

            asprintf(&s, "CURRENT%i", games[client]->currentPlayer);

            ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[0].addr, s);
            ws_sendframe_txt((ws_cli_conn_t *)games[client]->players[1].addr, s);

            free(s);
        }
        else
        {
            ws_sendframe_txt(client, "NOT_YOU");
        }
    }
}

int main(void)
{
    srand(time(0));

    struct ws_events evs;
    evs.onopen = &onopen;
    evs.onclose = &onclose;
    evs.onmessage = &onmessage;
    printf("Starting server on port %i\n", PORT);
    ws_socket(&evs, PORT, 0, 1000);
    return (0);
}