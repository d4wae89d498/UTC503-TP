#pragma once

#include "board_game.hpp"

class Puissance4 : public BoardGame
{
    ushort moves = 0;

    game_state handleMove(unsigned int x, unsigned int y, char c)
    {
        (void) x;
        (void) y;
        (void) c;
        (void) moves; 
        return ILLEGAL_MOVE;
    }
};