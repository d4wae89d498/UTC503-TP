#pragma once

#include "board_game.hpp"

class Puissance4 : public BoardGame
{
    ushort moves = 0;

    bool checkLines(char playerSymbol)
    {
        ushort i = 0;
        while (i <= max_y)
        {
            ushort total = 0;
            ushort y = 0;
            while (y <= max_x)
            {
                if (cases[i][y] == playerSymbol)
                    total += 1;
                y += 1;
            }
            if (total == 3)
                return true;
            i += 1;
        }
        return false;
    }

    bool checkColumns(char playerSymbol)
    {
        ushort i = 0;
        while (i <= max_y)
        {
            ushort total = 0;
            ushort y = 0;
            while (y <= max_x)
            {
                if (cases[y][i] == playerSymbol)
                    total += 1;
                y += 1;
            }
            if (total == 3)
                return true;
            i += 1;
        }
        return false;
    }

    bool equal()
    {
        if(moves == (max_x + 1) * (max_y + 1))
        {
            return true;
        }
        return false;
    }

    bool win(char playerSymbol)
    {
        if (checkLines(playerSymbol) || checkColumns(playerSymbol))
            return true;
        return false;
    }

    public:

    Puissance4() 
    {
        max_x = 7;
        max_y = 6;
    }

    static char getSymbol(Player p)
    {
        return p.is_first ? 'x' : 'o';
    }

    /*
     *  Returns false if illegal move, true else
     */ 
    game_state handleMove(unsigned int x, unsigned int y, char c)
    {
        (void) c;
        if (x > max_x || y > max_y)
            return ILLEGAL_MOVE;
        if (cases[y][x] != EMPTY_CASE)
            return ILLEGAL_MOVE;
        if (!bothPlayerConnected)
            return ILLEGAL_MOVE;
        ushort p = 0;
        while (p <= y)
        {
            if (cases[p][x] != EMPTY_CASE)
            {
                return ILLEGAL_MOVE;
            }
            p += 1;
        }
        char playerSymbol = getSymbol(*currentPlayer());     
        cases[y][x] = playerSymbol;
        draw();
        moves += 1;
        if (win(playerSymbol))
        {
            locked = true;
            currentPlayer()->score += 1;
            moves = 0;
            return (currentPlayer()->is_first ? PLAYER_1_WIN : PLAYER_2_WIN);
        }
        else if (equal())
        {
            locked = true;
            players[0].score += 1;
            players[1].score += 1;
            moves = 0;
            return EQUAL;
        }
        rotate();
        return IN_PROGRESS;
    }
};
