/*
** malloc.c
**
** Made by tais2.laaraj@epitech.eu
** Login   <>
**
** Started on  Tue Jan 22 13:54:15 2019 tais2.laaraj@epitech.eu
** Last update Mon Feb 3 21:32:14 2019 tais2.laaraj@epitech.eu
*/

#include <stddef.h>
#include "libmy_malloc.h"
#include <stdio.h>
#include <string.h>
#include <unistd.h>

static void *head = NULL;

void *first_fist(size_t size)
{
    void *end = sbrk(0);
    blockMemory_t *myBlock;
    blockMemory_t *new;
    size_t meta = sizeof(blockMemory_t);

    for (void *tmp = head; tmp < end && tmp > head;
        tmp += myBlock->size + (2 * meta))
    {
        myBlock = tmp;
        if (myBlock->is_Free == true && myBlock->size >= size &&
            (tmp + myBlock->size + meta) < end)
        {
            new = tmp;
            new->is_Free = false;
            new->size = myBlock->size;
            tmp = tmp + meta;
            new = tmp;
            myBlock->is_Free = false;
            myBlock->size = myBlock->size;
            return (tmp);
        }
    }
    return (NULL);
}

void *malloc(size_t size)
{
    void *request;
    blockMemory_t *myBlock;

    if (head == NULL)
    {
        head = sbrk(0);
    }
    if (size == 0)
    {
        return (NULL);
    }
    request = first_fist(size);
    if (request == NULL)
    {
        request = sbrk(size + (sizeof(blockMemory_t) * 2));
        myBlock = request;
        if (myBlock == (void *)-1)
            return (NULL);
        myBlock->is_Free = false;
        myBlock->size = size;
        myBlock = request + size + sizeof(blockMemory_t);
        myBlock->is_Free = false;
        myBlock->size = size;
        myBlock = myBlock - size;
    }
    return (request + sizeof(blockMemory_t));
}

void *realloc(void *block, size_t size)
{
    blockMemory_t *meta;
    void *request;

    if (block == NULL)
        return (malloc(size));
    meta = block - sizeof(blockMemory_t);
    request = malloc(size);
    memcpy(request, block, (size < meta->size ? size : meta->size));
    meta->is_Free = true;
    meta = block + meta->size;
    meta->is_Free = true;
    return (request);
}

void free(void *block)
{
    blockMemory_t *meta;

    if (block == NULL)
        return;
    meta = block - sizeof(blockMemory_t);
    if (block - sizeof(blockMemory_t) < head ||
        block + meta->size + sizeof(blockMemory_t) > sbrk(0))
        return;
    meta->is_Free = true;
    meta = block - sizeof(blockMemory_t);
    meta->is_Free = true;
    meta = sbrk(0) - sizeof(blockMemory_t);
    return;
}

void show_alloc_mem(void)
{
    blockMemory_t *tempo;

    tempo = head;
    printf("break : %p/n", sbrk(0));
    while (tempo != NULL)
    {
        if (tempo->is_Free == false)
            printf("%p - %p : %zu\n", tempo, tempo->size, tempo->size);
        tempo = tempo->next;
    }
}
