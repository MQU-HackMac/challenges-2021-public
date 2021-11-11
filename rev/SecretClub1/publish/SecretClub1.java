import java.util.*;

class SecretClub {
    public static void main(String args[]) {
        SecretClub secretClub = new SecretClub();
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter Secret Club password: ");
        String userInput = scanner.next();
	String input = userInput.substring("HACKMAC{".length(),userInput.length()-1);
	if (secretClub.checkPassword(input)) {
	    System.out.println("Welcome to the Secret Club!");
	} else {
	    System.out.println("You are not welcome!");
        }
    }

    // Welcome to the entrance of the Secret Club! Only incredibly
    // talented and skillful cyber individuals can have access to 
    // this club! All you need to do is provide me the password, which
    // is *impossible* to find! So, while you struggle to find the password, 
    // I am going to enjoy my lunch, a Caesar salad! ;)


    public boolean checkPassword(String password) {
        byte[] passBytes = password.getBytes();
        byte[] myBytes = {
            102, 68, 54, 86, 100, 85, 98, 117, 
            0x36, 0x59, 0x36, 0x75, 0x38, 0x68, 0x67, 0x62, 0x6c, 
            '8', 'b', 'u', 'D', 'v', '6', 'D', 'f',
        };
        for (int i=0; i<24; i++) {
            if (passBytes[i]+3 != myBytes[i]) {
                return false;
            }
        }
        return true;
    }    
}