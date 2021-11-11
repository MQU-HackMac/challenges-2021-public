#include <stdio.h>
#include <stdlib.h>

#define SIZE 0x1100
#define GOAL 0xcafefeed

const char *HEADER =
    "                  _.._ \n"
    "   _________....-~    ~-.______ \n"
    "~~~                            ~~~~-----...___________..--------\n"
    "                                           |   |     |\n"
    "                                           | |   |  ||\n"
    "                                           |  |  |   |\n"
    "                                           |'. .' .`.|\n"
    "___________________________________________|0oOO0oO0o|____________\n"
    " -          -         -       -      -    / '  '. ` ` \\    -    -\n"
    "      --                  --       --   /    '  . `   ` \\    --\n"
    "---            ---          ---       /  '                \\ ---\n"
    "     ----               ----        /       ' ' .    ` `    \\  ----\n"
    "-----         -----         ----- /   '   '        `      `   \\\n"
    "    ----             ------     /          '    . `     `    `  \\\n"
    "            -------           /  '    '      '      `      '      \\\n"
    "    ---             --------/     '     '   '          '      `\n";

int main(void)
{
  long code = 0;
  char waterfall[SIZE];

  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);

  puts(HEADER);
  puts("Wow, a lovely waterfall");
  puts("What should we add to this?");

  gets(waterfall);

  if (code == GOAL)
  {
    printf("\n%llx\n\n", GOAL);
    puts("Ok... that's an idea");
    puts("we appreciate any feedback");
    puts("so have a flag for your troubles\n");
    puts("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    system("cat /flag.txt");
    puts("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  }
  else
  {
    printf("\nsuggestion: %llx\n", code);
  }

  return 0;
}
