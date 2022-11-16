CFLAGS		=-std=c++11 -g -fsanitize=address#-Wall -Werror -Wextra
CSRCS		=server.cpp
COBJS		=$(CSRCS:.cpp=.o)
CLIBS		=wsServer/libws.a
CINCLUDES	=-IwsServer/include

TFLAGS		=--module es2015
TSRCS		=tiktaktoe.ts
TOBJS		=$(TSRCS:.ts=.js)
#export PATH=/usr/local/opt/llvm/bin:$PATH
#clang --target=wasm32 --no-standard-libraries -Wl,--export-all -Wl,--no-entry -o player.wasm player.cpp
all: Makefile server #client
submodules:
	make -C wsServer
submodules_fclean:
	make -C wsServer clean
%.o: %.cpp submodules server.h
	clang++ $(CFLAGS) $(CINCLUDES) -c $< -o $@ -IwsServer
%.js: %.ts
	tsc $(TFLAGS) $<
server: $(COBJS)
	clang++ $(CFLAGS) $(COBJS) $(CLIBS) -o $@
client: $(TOBJS)
clean:
	rm -rf $(COBJS)
fclean: clean submodules_fclean
#	rm -rf $(TOBJS)
#	rm -rf server
re: fclean all
.PHONY: clean fclean re all submodules submodules_fclean client
.SUFFIXES:





