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

map<void*, TikTakToe*> games;

char*   get_packet(const unsigned char *msg, char *type)
{
    if (!strncmp((char*)msg, type, strlen(type)))
        return (char*)msg + strlen(type);
    return 0;
}

void onopen(ws_cli_conn_t *client)
{
    char *addr;
    addr = ws_getaddress(client);
    printf("Client connected : %s[%p]\n", addr, client);
    games[client] = new TikTakToe();
}

void onclose(ws_cli_conn_t *client)
{
    char *addr;
    addr = ws_getaddress(client);
    printf("Client disconnected : %s[%p]\n", addr, client);
}

void onmessage(ws_cli_conn_t *client, const unsigned char *msg, uint64_t size, int type)
{
    (void) type;
    char *addr;
    addr = ws_getaddress(client);
    printf("Client message : %s[%p] -> %s\n", addr, client, (const char*)msg);
    char    *packet_data;
    if ((packet_data = get_packet(msg, "NAME")))
    {
        games[client]->players[0].name = strdup(packet_data);
        printf("New name '%s'\n", strdup(games[client]->players[0].name));
    }
    if ((packet_data = get_packet(msg, "OPPONENT")))
    {
        for (auto it = games.begin(); it != games.end(); ++it)
        {
            if (it->second->players[0].name && !strcmp(it->second->players[0].name, packet_data))
            {
                it->second->players[1].name = games[client]->players[0].name;
                delete games[client];
                games[client] = it->second;
                printf("NEW MATCH: %s vs %s\n", it->second->players[0].name, it->second->players[1].name);
                return ;
            }
        }

        printf("OPPONENT NOT FOUND!! %s", packet_data);
    }
    printf("[%s]\n", packet_data);
}

int main(void)
{
    srand(time(0));

    struct ws_events evs;
    evs.onopen    = &onopen;
    evs.onclose   = &onclose;
    evs.onmessage = &onmessage;
    printf("Starting server on port %i\n", PORT);
    ws_socket(&evs, PORT, 0, 1000);
    return (0);
}