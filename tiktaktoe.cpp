#define MAX_Board_SIZE 128
#include <iostream>
#include <map>

using namespace std;

class Player 
{
    public:

    void *addr;
    char *name = 0;
    int score = 0;

    Player()
    {
        score = 0;
    }

    ~ Player()
    {
        free(name);
    }
};

class Board 
{
    public:
    char    grid[MAX_Board_SIZE][MAX_Board_SIZE];
    int     boardWidth;
    int     boardHeight;

    Board(int boardWidth, int boardHeight)
    {
        this->boardHeight = boardHeight;
        this->boardWidth = boardWidth;
        int i = 0;
        while (i < boardHeight)
        {
            int y = 0;
            while (y < boardWidth)
            {
                this->grid[i][y] = ' ';
                y += 1;
            }
            i += 1;
        }
    }
};

class BoardGame : public Board
{
    public:
    bool    currentPlayer;
    Player  players[2];
    int     moves;

    BoardGame(int boardWidth, int boardHeight) : Board(boardWidth, boardHeight)
    {
        currentPlayer = 0;
        moves = 0;
    }

    Player *getCurrentPlayer()
    {
        return &players[currentPlayer];
    }

    void    changePlayer()
    {
        currentPlayer = !currentPlayer;
    }

    void    draw()
    {
        printf("boardHeight : %i boardWidth : %i\n", boardHeight , boardWidth);
        int i = 0;
            cout << "______________" << endl;
        while (i < boardHeight)
        {
            int y = 0;
            cout << "| ";
            while (y < boardWidth)
            {
                cout << grid[i][y] << " | ";
                y += 1;
            }
            cout << endl << "______________" << endl;
            cout << endl;
            i += 1;
        }
    }
};

class TikTakToe : public BoardGame 
{
    public:
    const char c[2] = {'o', 'x'};

    void clear()
    {
        int i = 0;
        while (i < boardHeight)
        {
            int y = 0;
            while (y < boardWidth)
            {
                grid[i][y] = ' ';
                y += 1;
            }
            i += 1;
        }
        moves = 0;
    }

    TikTakToe() : BoardGame(3, 3)
    {
        clear();
    }

   
    bool checkLines()
    {
        char playerSymbol = c[currentPlayer];
        int i = 0;
        while (i < this->boardHeight)
        {
            int total = 0;
            int y = 0;
            while (y < this->boardWidth)
            {
                if (this->grid[i][y] == playerSymbol)
                    total += 1;
                y += 1;
            }
            if (total == 3)
                return true;
            i += 1;
        }
        return false;
    }

    bool checkColumns()
    {
        char playerSymbol = c[currentPlayer];
        int i = 0;
        while (i < this->boardHeight)
        {
            int total = 0;
            int y = 0;
            while (y < this->boardWidth)
            {
                if (this->grid[y][i] == playerSymbol)
                    total += 1;
                y += 1;
            }
            if (total == 3)
                return true;
            i += 1;
        }
        return false;
    }

    bool checkDiagonalA()
    {
        char playerSymbol = c[currentPlayer];
        int i = 0;
        int total = 0;
        while (i < this->boardHeight)
        {
            if (this->grid[i][i] == playerSymbol)
                total += 1;
            i += 1;
        }
        if (total == 3)
            return true;
        return false;
    }

    bool checkDiagonalB()
    {
        char playerSymbol = c[currentPlayer];
        int i = 0;
        int total = 0;
        while (i < this->boardHeight)
        {
            if (this->grid[this->boardHeight - i][i] == playerSymbol)
                total += 1;
            i += 1;
        }
        if (total == 3)
            return true;
        return false;
    }

    public:

    bool move(const char *str)
    {
        int i, y;
        if (sscanf(str, "%i-%i", &i, &y) != 2)
            return false;
        printf("i=%i y=%i\n", i, y);
        i -= 1;
        y -= 1;
        if (i < 0 || i > 2 || y < 0 || y > 2)
            return false;
        if (this->grid[i][y] != ' ')
            return false;
        moves += 1;
        this->grid[i][y] = c[currentPlayer];
        this->draw();
        return true;
    }

    bool win()
    {
        if (checkLines() || checkColumns() || checkDiagonalA() || checkDiagonalB())
        {
            this->getCurrentPlayer()->score += 1;
            return true;
        }
        return false;
    }

    bool equal()
    {
        return moves == boardWidth * boardHeight;
    }
};

