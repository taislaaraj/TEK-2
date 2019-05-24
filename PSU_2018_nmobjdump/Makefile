##
## EPITECH PROJECT, 2018
## my_objdump_2018
## File description:
## Makefile
##

SRC=	./objdump/src/main.c \
		./objdump/src/form32.c  \
		./objdump/src/checkelf32.c  \
		./objdump/src/form64.c	\
		./objdump/src/checkelf64.c  \
		./objdump/src/detect.c

OBJ=		$(SRC:.c=.o)

CFLAGS= 	-W -Wall -Wextra -g3

NAME=		my_objdump

CC=		gcc

RM=		rm -f

all: 		$(NAME)

$(NAME): 	$(OBJ)
		cc -o $(NAME) $(OBJ)

objdump:	$(OBJ)
		cc -o $(NAME) $(OBJ)

nm:	$(OBJ)
		cc -o $(NAME) $(OBJ)

clean:
		rm -f $(OBJ)

fclean: 	clean
		rm -f $(NAME)
		rm -f $(WAY)*.c~
		rm -f *.c~

re:		fclean all
