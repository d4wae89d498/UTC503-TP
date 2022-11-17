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
                else 
                    total = 0;
                if (total == 4)
                    return true;
                y += 1;
            }
            
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
                else 
                    total = 0;
                if (total == 4)
                    return true;
                y += 1;
            }
            
            i += 1;
        }
        return false;
    }


    bool checkDiagonalD(char playerSymbol)
    {
        (void) playerSymbol;
        int x = 0;
        while (x <= max_x)
        {
           int count = 0;
            int y = 0;
            while (y <= x && y <= max_y)
            {
                printf("check diagonal D : y=%i x=%i \n", max_y - y, max_x - x + y);
                if (cases[max_y - y][max_x - x + y] == playerSymbol)
                {
                    count += 1;
                    if (count == 4)
                        return true;
                }
                else 
                    count = 0;
                y += 1;
            }
            printf("\n\n");
            x += 1;
        }
        return false;
    }

    bool checkDiagonalC(char playerSymbol)
    {
        (void) playerSymbol;
        int x = 0;
        while (x <= max_x)
        {
           int count = 0;
            int y = 0;
            while (y <= x && y <= max_y)
            {
                printf("check diagonal C : y=%i x=%i \n", y, max_x - x + y);
                if (cases[y][max_x - x + y] == playerSymbol)
                {
                    count += 1;
                    if (count == 4)
                        return true;
                }
                else 
                    count = 0;
                y += 1;
            }
            printf("\n\n");
            x += 1;
        }
        return false;
    }

    bool checkDiagonalB(char playerSymbol)
    {
        (void) playerSymbol;
        int x = 0;
        while (x <= max_x)
        {
           int count = 0;
            int y = 0;
            while (y <= x && y <= max_y)
            {
                printf("check diagonal B : y=%i x=%i \n", max_y - y, x - y);
                if (cases[max_y - y][x - y] == playerSymbol)
                {
                    count += 1;
                    if (count == 4)
                        return true;
                }
                else 
                    count = 0;
                y += 1;
            }
            printf("\n\n");
            x += 1;
        }
        return false;
    }

    bool chekDiagonalA(char playerSymbol)
    {
        (void) playerSymbol;
        int x = 0;
        while (x <= max_x)
        {
           int count = 0;
            int y = 0;
            while (y <= x && y <= max_y)
            {
                printf("check diagonal A : y=%i x=%i \n", y, x - y);
                if (cases[y][x - y] == playerSymbol)
                {
                    count += 1;
                    if (count == 4)
                        return true;
                }
                else 
                    count = 0;
                y += 1;
            }
            printf("\n\n");
            x += 1;
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
        if (checkLines(playerSymbol) || checkColumns(playerSymbol) || chekDiagonalA(playerSymbol) || checkDiagonalB(playerSymbol) || checkDiagonalC(playerSymbol) || checkDiagonalD(playerSymbol))
            return true;
        return false;
    }

    public:

    Puissance4() 
    {
        max_x = 6;
        max_y = 5;
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
        printf("MoVE!!\n");
        (void) c;
        if (x > max_x || y > max_y)
            return ILLEGAL_MOVE;
        if (cases[y][x] != EMPTY_CASE)
            return ILLEGAL_MOVE;
        if (!bothPlayerConnected)
            return ILLEGAL_MOVE;
        ushort p = 0;
        while (p <= max_y)
        {
            if (cases[p][x] == EMPTY_CASE && p > y)
            {
                printf("illegal : y=%i x=%i p=%i\n", y, x, p);
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
