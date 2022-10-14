CFLAGS		=-Wall -Werror -Wextra -std=c99
CSRCS		=server.c
COBJS		=$(CSRCS:.c=.o)
CLIBS		=wsServer/libws.a
CINCLUDES	=-IwsServer/include

TFLAGS		=
TSRCS		=client.ts
TOBJS		=$(TSRCS:.ts=.js)

all: server client
submodules:
	make -C wsServer
submodules_fclean:
	make -C wsServer clean
%.o: %.c submodules server.h
	cc $(CFLAGS) $(CINCLUDES) -c $< -o $@ -IwsServer
%.js: %.ts
	tsc $< --outFile $@
server: $(COBJS)
	cc $(CFLAGS) $(COBJS) $(CLIBS) -o $@
client: $(TOBJS)
clean:
	rm -rf $(COBJS)
fclean: clean submodules_fclean
	rm -rf $(TOBJS)
	rm -rf server
re: fclean all
.PHONY: clean fclean re all submodules submodules_fclean client
.SUFFIXES:





