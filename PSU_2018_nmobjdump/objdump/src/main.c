/*
** EPITECH PROJECT, 2018
** nmobjdump
** File description:
** main
*/

#include "../include/my_objdump.h"

static void *check_mmap(int fd)
{
    long size = 0;
    void *data;

    size = lseek(fd, 0, SEEK_END);
    if (size == -1)
        return ((void *)84);
    data = mmap(NULL, size, PROT_READ, MAP_SHARED, fd, 0);
    if (data == ((void *)-1)) {
        close(fd);
        return (data);
    }
    return (data);
}

static int check_file(char *filename)
{
    int fd;

    fd = open(filename, O_RDONLY, 0);
    if (fd == -1)
        return (fd);
    return (fd);
}

int check_argument(char *filepath)
{
    int fd = 0;
    void *data;
    Elf32_Ehdr *elf;

    if (access(filepath, F_OK) == -1)
        return (84);
    fd = check_file(filepath);
    if (fd == -1)
        return (84);
    data = check_mmap(fd);
    if (data == ((void *)84) || (data == (void *)-1))
        return (84);
    elf = (Elf32_Ehdr *)data;
    if (elf->e_ident[EI_CLASS] == ELFCLASS32)
        format32(data, filepath);
    else if (elf->e_ident[EI_CLASS] == ELFCLASS64)
        format64(data, filepath);
    return (0);
}

int main(int ac, char **av)
{
    int re;

    if (ac > 1)
        for (int i = 1; i < ac; i++)
            re = check_argument(av[i]);
    else if (ac == 1)
        re = check_argument("./a.out");
    return (re);
}