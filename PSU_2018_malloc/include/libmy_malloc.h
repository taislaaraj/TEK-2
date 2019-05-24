/*
** libmy_malloc.h
**
** Made by tais2.laaraj@epitech.eu
** Login   <>
**
** Started on  Tue Jan 22 13:55:56 2019 tais2.laaraj@epitech.eu
** Last update Sun Feb 2 17:26:28 2019 tais2.laaraj@epitech.eu
*/

#ifndef LIBMY_MALLOC_H_
#define LIBMY_MALLOC_H_

#include <stdbool.h>
#include <stddef.h>

// char mem[20000];
#define MY_SIZE = 2 * sizeof(blockMemory_t);

typedef struct blockMemory_s
{
    size_t size;
    bool is_Free;
    struct blockMemory_s *next;
} blockMemory_t;

// blockMemory_t *head = (void *)mem;

// void splitMyBlock(blockMemory_t *block, size_t size);
// void *malloc(size_t size);
// void merge();
// void free(void *block);

#endif /* !LIBMY_MALLOC_H_ */
