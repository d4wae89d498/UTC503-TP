#define PORT 8020
#define GAME_TYPE Puissance4

#include "puissance4.hpp"
#include "common_protocol.hpp"

int main(void)
{
    srand(time(0));

    struct ws_events evs;
    evs.onopen = &onopen;
    evs.onclose = &onclose;
    evs.onmessage = &onmessage;
    printf("Starting TIKTAKTOE server on port %i\n", PORT);
    ws_socket(&evs, PORT, 0, 1000);
    return (0);
}
