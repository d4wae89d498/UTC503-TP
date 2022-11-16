#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <cassert>

#define EMPTY_CASE ' '

typedef unsigned short ushort;

typedef enum 
{
    ILLEGAL_MOVE,
    IN_PROGRESS,
    EQUAL,
    PLAYER_1_WIN,
    PLAYER_2_WIN
} game_state;

class Player 
{
    public:
    unsigned int score = 0;
    bool is_first;
};

class BoardGame 
{
    public:
    ushort              max_x;
    ushort              max_y;
    char                cases[255][255] = {[0 ... 254] = {[0 ... 254] = EMPTY_CASE}};
    Player              players[2];
    bool                currentPlayerIndex = 0;
    bool                bothPlayerConnected = 0;

    virtual     game_state handleMove(unsigned int x, unsigned int y, char c)
    {
        printf("ERROR %s:%i\n", __FILE__, __LINE__);
        assert(0);
        return ILLEGAL_MOVE;
    }

    void draw()
    {
        ushort y = 0;
        printf("-------------\n");
        while (y <= max_y)
        {
            ushort x = 0;
            printf("|");
            while (x <= max_x)
            {
                printf(" %c |", cases[y][x]);
                x += 1;
            }
            printf("\n");
            printf("-------------\n");
            y += 1;
        }
    }



    void start()
    {
        currentPlayerIndex = rand() % 2;        
        players[currentPlayerIndex].is_first = true;
        players[!currentPlayerIndex].is_first = false;
    }

    void rotate()
    {
        currentPlayerIndex = !currentPlayerIndex;
    }

    /*
     *  Returns true if last player has discon 
     */ 
    bool handleDiscon(int player)
    {
        if (bothPlayerConnected)
        {
            if (player == 0)
                players[0] = players[1];
            players[0].score = 0;
            bothPlayerConnected = false;
            return false;
        }
        else
        {
            return true;
        }
    }

    Player *currentPlayer()
    {
        return &players[currentPlayerIndex];
    }
};


