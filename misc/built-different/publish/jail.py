def lol(*args, **kwargs):
    print('VERY bad bad!')

super_special_not_for_you = __builtins__.eval
__builtins__.exec = lol
__builtins__.eval = lol
__builtins__.open = lol

swear_words = dir(__builtins__) + ['flag', 'import', 'system', 'builtins']

def jail():
    i = input('>> ')
    for x in swear_words:
        if x in i:
            print('bad bad!')
            return
    try:
        super_special_not_for_you(super_special_not_for_you(i))
    except Exception as e:
        print('wow... look what you did')
        print(e)
        return

while True:
    jail()
