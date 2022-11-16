CFLAGS	=	-I./server/wsServer/include -std=c++11 -g -fsanitize=address #-Wall -Werror -Wextra
DEPS = Makefile $(shell ls server/*.hpp) server/wsServer/libws.a

all: tiktaktoe_server puissance4_server
submodules:
	make -C server/wsServer
submodules_clean:
	make -C server/wsServer clean
tiktaktoe_server:	server/tiktaktoe.cpp submodules $(DEPS) 
	clang++ $(CFLAGS) $< server/wsServer/libws.a -o $@
puissance4_server: server/puissance4.cpp submodules  $(DEPS) 
	clang++ $(CFLAGS) $< server/wsServer/libws.a -o $@
clean:
	rm -rf tiktaktoe_server puissance4_server
re: clean all
.PHONY: clean re all submodules submodules_clean
.SUFFIXES:





