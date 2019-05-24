/*
** EPITECH PROJECT, 2018
** nmobjdump
** File description:
** my_objdump
*/

#ifndef MY_OBJDUMP_H_
#define MY_OBJDUMP_H_

#include <sys/mman.h>
#include <elf.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <ctype.h>
#include <errno.h>

void format32(void *data, char *filepath);
void format64(void *data, char *filepath);
void coma_section(int p_coma, char *data);
int check_elf_32(Elf32_Ehdr *elf, char *path);
void print_asc_32(unsigned int j, unsigned int *z, unsigned char *w, char *t);
void print_sect_32(char *strtab, Elf32_Ehdr *elf, Elf32_Shdr *shdr, int i);
void print_sect32(char *strtab, Elf32_Ehdr *elf, Elf32_Shdr *shdr);
int detect_typ_32(void *data);
int section_detect(void *data, char *comp);
int type_detect(void *data);
void print_sect64(char *strtab, Elf64_Ehdr *elf, Elf64_Shdr *shdr);
void print_sect(char *strtab, Elf64_Ehdr *elf, Elf64_Shdr *shdr, int i);
void print_asc(unsigned int j, unsigned int *z, unsigned char *w, char *t);
int check_elf(Elf64_Ehdr *elf, char *path);

#endif /* !MY_OBJDUMP_H_ */
