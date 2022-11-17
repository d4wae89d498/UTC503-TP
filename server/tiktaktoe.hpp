#pragma once

#include "board_game.hpp"

class TikTakToe : public BoardGame
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

    bool checkDiagonalA(char playerSymbol)
    {
        ushort i = 0;
        ushort total = 0;
        while (i <= max_y)
        {
            if (cases[i][i] == playerSymbol)
                total += 1;
            i += 1;
        }
        if (total == 3)
            return true;
        return false;
    }

    bool checkDiagonalB(char playerSymbol)
    {
        ushort i = 0;
        ushort total = 0;
        while (i <= max_y)
        {
            if (cases[max_y - i][i] == playerSymbol)
                total += 1;
            i += 1;
        }
        if (total == 3)
            return true;
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
        if (checkLines(playerSymbol) || checkColumns(playerSymbol) || checkDiagonalA(playerSymbol) || checkDiagonalB(playerSymbol))
            return true;
        return false;
    }

    public:

    TikTakToe() 
    {
        max_x = 2;
        max_y = 2;
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
