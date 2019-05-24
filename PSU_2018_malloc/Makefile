##
## EPITECH PROJECT, 2018
## Makefile
## File description:
## corewar
##

CC	=	gcc

WAY	=	./src

SRC	=	$(WAY)/malloc.c			\

OBJ	=	$(SRC:.c=.o)

CFLAGS	=	-shared -W -Wall -Wextra -Werror -fpic -g3 -I./include -fno-builtin

WAY_TST	=	./tests

NAME	=	libmy_malloc.so

all:	$(OBJ)
	$(CC) -o $(NAME) $(OBJ) $(CFLAGS)

clean:
	# make clean -C./$(WAY_TST)
	# make clean -C./$(WAY_LIB)
	$(RM) $(OBJ)
	$(RM) $(OBJ_2)

fclean:	clean
	# make fclean -C./$(WAY_TST)
	# make fclean -C./$(WAY_LIB)
	$(RM) $(NAME)

re:	clean all

tests_run:
	make -C./$(WAY_TST)
