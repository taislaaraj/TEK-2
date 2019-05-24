/*
** EPITECH PROJECT, 2018
** nmobjdump
** File description:
** f64
*/

#include "../include/my_objdump.h"

void coma_section(int p_coma, char *data)
{
    static int cs = 0;

    if (p_coma == 1)
        printf(", %s", data);
    else if (p_coma == 0) {
        if (cs == 0)
            printf("%s", data);
        else
            printf(" %s", data);
        cs = 1;
    }
}

static void flag_sect(void *data, Elf64_Ehdr *elf, int *p_coma,
int *count_flags)
{
    static int first = 0;

    if (section_detect(data, ".symtab")) {
        if (first == 1)
            coma_section(*p_coma, "HAS_SYMS");
        *p_coma = 1;
        *count_flags += 0x10;
    }
    if (elf->e_type == ET_DYN) {
        if (first == 1)
            coma_section(*p_coma, "DYNAMIC");
        *p_coma = 1;
        *count_flags += 0x40;
    }
    first = 1;
}

static void flag_nex(void *data, Elf64_Ehdr *elf, int *p_coma, int *count_flags)
{
    static int first = 0;

    if (elf->e_type == ET_EXEC) {
        if (first == 1)
            coma_section(*p_coma, "EXEC_P");
        *p_coma = 1;
        *count_flags += 0x02;
    } if (section_detect(data, ".line")) {
        if (first == 1)
            coma_section(*p_coma, "HAS_LINENO");
        *p_coma = 1;
        *count_flags += 0x04;
    } if (section_detect(data, ".debug")) {
        if (first == 1)
            coma_section(*p_coma, "HAS_DEBUG");
        *p_coma = 1;
        *count_flags += 0x08;
    }
    flag_sect(data, elf, p_coma, count_flags);
    first = 1;
}

static int printFlags(void *data, Elf64_Ehdr *elf)
{
    int count_flags = 0x00;
    int p_coma = 0;
    static int first = 0;

    if (elf->e_type == ET_REL) {
        if (first == 1)
            coma_section(p_coma, "HAS_RELOC");
        p_coma = 1;
        count_flags += 0x01;
    }
    flag_nex(data, elf, &p_coma, &count_flags);
    if (type_detect(data)) {
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

void format64(void *data, char *filename)
{
    Elf64_Ehdr *elf;
    Elf64_Shdr *shdr;
    char *strtab;

    elf = (Elf64_Ehdr *)data;
    if (check_elf(elf, filename) == -1)
        return;
    shdr = (Elf64_Shdr *)((uint8_t *)data + elf->e_shoff);
    strtab = (char *)((uint8_t *)data + shdr[elf->e_shstrndx].sh_offset);
    printf("\n%s:      file format %s\n", filename, "elf64-x86-64");
    printf("architecture: i386:x86-64, flags 0x%08x:\n", printFlags(data, elf));
    printFlags(data, elf);
    printf("\nstart address 0x%016x\n\n", (int)elf->e_entry);
    print_sect64(strtab, elf, shdr);
}