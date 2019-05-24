/*
** EPITECH PROJECT, 2018
** nmobjdump
** File description:
** f64
*/

#include "../include/my_objdump.h"

int section_detect(void *data, char *comp)
{
    Elf64_Ehdr *elf = (Elf64_Ehdr *)data;
    Elf64_Shdr *shdr = (Elf64_Shdr *)((uint8_t *)data + elf->e_shoff);
    char *strtab = (char *)((uint8_t *)data + shdr[elf->e_shstrndx].sh_offset);

    for (int count = 0; count < elf->e_shnum; count++) {
        if (strcmp(&strtab[shdr[count].sh_name], comp) == 0)
            return (1);
    }
    return (0);
}