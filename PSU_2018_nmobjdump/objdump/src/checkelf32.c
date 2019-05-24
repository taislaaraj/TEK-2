/*
** EPITECH PROJECT, 2018
** nmobjdump
** File description:
** f32
*/

#include "../include/my_objdump.h"

int check_elf_32(Elf32_Ehdr *elf, char *path)
{
    if (elf->e_ident[EI_MAG0] != ELFMAG0 || elf->e_ident[EI_MAG1] != ELFMAG1 ||
    elf->e_ident[EI_MAG2] != ELFMAG2 || elf->e_ident[EI_MAG3] != ELFMAG3 ||
    (elf->e_type != ET_EXEC && elf->e_type != ET_REL && elf->e_type != ET_DYN))
    {
        fprintf(stderr, "nm: %s: File format not recognized\n", path);
        return (-1);
    }
    return (1);
}

void print_asc_32(unsigned int j, unsigned int *z, unsigned char *w, char *t)
{
    int x = j;
    
    while (x % 16 != 0) {
        if (x % 4 == 0 && x % 16)
            printf(" ");
        printf("  ");
        ++x;
    }
    printf("  ");
    while (*z < j) {
        if (isprint(w[*z]))
            printf("%c", t[*z]);
        else
            printf(".");
        (*z)++;
    }
    while ((*z)++ % 16 != 0)
        printf(" ");
    *z = j;
    printf("\n");
}

void print_sect_32(char *strtab, Elf32_Ehdr *elf, Elf32_Shdr *shdr, int i)
{
    unsigned char *w;
    unsigned int j = 0;
    int addr = shdr[i].sh_addr;
    unsigned int z = 0;

    printf("Contents of section %s :\n", &strtab[shdr[i].sh_name]);
    w = (unsigned char *)((char *)elf + shdr[i].sh_offset);

    while (j < shdr[i].sh_size)
    {
        if (j % 16 == 0)
            printf(" %04x ", addr);
        printf("%02x", w[j++]);
        if (j % 4 == 0 && j % 16 && j < shdr[i].sh_size)
            printf(" ");
        if (j % 16 == 0)
            addr += 16;
        if (j % 16 == 0 || j >= shdr[i].sh_size)
            print_asc_32(j, &z, w, (char *)w);
    }
}

void print_sect32(char *strtab, Elf32_Ehdr *elf, Elf32_Shdr *shdr)
{
    for (int i = 0; i < elf->e_shnum; i++)
    {
        if (shdr[i].sh_size && strcmp(&strtab[shdr[i].sh_name], ".strtab") &&
        strcmp(&strtab[shdr[i].sh_name], ".symtab") &&
        strcmp(&strtab[shdr[i].sh_name], ".shstrtab") &&
        strcmp(&strtab[shdr[i].sh_name], ".bss") &&
        strcmp(&strtab[shdr[i].sh_name], ".rela.eh_frame") &&
        strcmp(&strtab[shdr[i].sh_name], ".rela.text"))
        {
            print_sect_32(strtab, elf, shdr, i);
        }
    }
}

int detect_typ_32(void *data)
{
    Elf32_Ehdr *elf = (Elf32_Ehdr *)data;
    Elf32_Shdr *shdr = (Elf32_Shdr *)((uint8_t *)data + elf->e_shoff);

    for (int count = 0; count < elf->e_shnum; count++)
        if (shdr[count].sh_type == SHT_DYNAMIC)
            return (1);
    return (0);
}