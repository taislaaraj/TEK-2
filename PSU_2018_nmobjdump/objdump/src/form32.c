/*
** EPITECH PROJECT, 2018
** nmobjdump
** File description:
** f32
*/

#include "../include/my_objdump.h"

static int detect_sect_32(void *data, char *comp)
{
    Elf32_Ehdr *elf = (Elf32_Ehdr *)data;
    Elf32_Shdr *shdr = (Elf32_Shdr *)((uint8_t *)data + elf->e_shoff);
    char *strtab = (char *)((uint8_t *)data + shdr[elf->e_shstrndx].sh_offset);

    for (int count = 0; count < elf->e_shnum; count++)
    {
        if (strcmp(&strtab[shdr[count].sh_name], comp) == 0)
            return (1);
    }
    return (0);
}

static void flag_sect_32(void *data, Elf32_Ehdr *elf, int *p_coma,
int *count_flags)
{
    static int first = 0;

    if (detect_sect_32(data, ".symtab"))
    {
        if (first == 1)
            coma_section(*p_coma, "HAS_SYMS");
        *p_coma = 1;
        *count_flags += 0x10;
    }
    if (elf->e_type == ET_DYN)
    {
        if (first == 1)
            coma_section(*p_coma, "DYNAMIC");
        *p_coma = 1;
        *count_flags += 0x40;
    }
    first = 1;
}

static void flag_nex_32(void *data, Elf32_Ehdr *elf, int *p_coma,
int *count_flags)
{
    static int first = 0;

    if (elf->e_type == ET_EXEC) {
        if (first == 1)
            coma_section(*p_coma, "EXEC_P");
        *p_coma = 1;
        *count_flags += 0x02;
    } if (detect_sect_32(data, ".line")) {
        if (first == 1)
            coma_section(*p_coma, "HAS_LINENO");
        *p_coma = 1;
        *count_flags += 0x04;
    } if (detect_sect_32(data, ".debug")) {
        if (first == 1)
            coma_section(*p_coma, "HAS_DEBUG");
        *p_coma = 1;
        *count_flags += 0x08;
    }
    flag_sect_32(data, elf, p_coma, count_flags);
    first = 1;
}

static int print_flag_32(void *data, Elf32_Ehdr *elf)
{
    int count_flags = 0x00;
    int p_coma = 0;
    static int first = 0;

    if (elf->e_type == ET_REL)
    {
        if (first == 1)
            coma_section(p_coma, "HAS_RELOC");
        p_coma = 1;
        count_flags += 0x01;
    }
    flag_nex_32(data, elf, &p_coma, &count_flags);
    if (detect_typ_32(data))
    {
        if (first == 1)
            coma_section(p_coma, "D_PAGED");
        count_flags += 0x100;
    }
    if (p_coma == 0)
        if (first == 1)
            printf("BFD_NO_FLAGS");
    first = 1;
    return (count_flags);
}

void format32(void *data, char *filename)
{
    Elf32_Ehdr *elf;
    Elf32_Shdr *shdr;
    char *strtab;

    elf = (Elf32_Ehdr *)data;
    if (check_elf_32(elf, filename) == -1)
        return;
    shdr = (Elf32_Shdr *)((uint8_t *)data + elf->e_shoff);
    strtab = (char *)((uint8_t *)data + shdr[elf->e_shstrndx].sh_offset);
    printf("\n%s:\tfile format %s\n", filename, "elf32-x86-32");
    printf("architecture: i386:x86-32, flags 0x%08x:\n",
    print_flag_32(data, elf));
    print_flag_32(data, elf);
    printf("\nstart address 0x%015x\n\n", (int)elf->e_entry);
    print_sect32(strtab, elf, shdr);
}