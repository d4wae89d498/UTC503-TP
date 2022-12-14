CFLAGS	=	-I./server/wsServer/include -std=c++11 -g -fsanitize=address
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
exit:
	kill $(shell lsof -t -i:8030) || echo
	kill $(shell lsof -t -i:8020) || echo	
	kill $(shell lsof -t -i:8667) || echo	
dev: all  exit
	./tiktaktoe_server &
	./puissance4_server &
	cd client && php -S 127.0.0.1:8667 &
	cd ..
clean:
	rm -rf tiktaktoe_server puissance4_server
re: clean all
.PHONY: clean re all submodules submodules_clean
.SUFFIXES:





