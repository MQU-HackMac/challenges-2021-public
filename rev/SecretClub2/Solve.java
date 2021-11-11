import java.util.*;

class Solve {
    public static void main(String args[]) {
        // Compared numbers when comparing password in original code
        int[] numbers = new int[] { 1650029619, 2053059694, 1147093553, 1312060025, 1599091811, 1261530681, 1600730463,
                1664118604 };

        System.out.println(solve(numbers));
    }

    public static String solve(int[] nums) {
        StringBuilder result = new StringBuilder();
        result.append("HACKMAC{");

        for (int i = 0; i < nums.length; i++) {
            String binaryString = Integer.toBinaryString(nums[i]);
            StringBuilder paddedBinaryString = new StringBuilder();
            while (paddedBinaryString.length() < 32 - binaryString.length()) {
                paddedBinaryString.append("0");
            }
            paddedBinaryString.append(binaryString);
            for (int j = 0; j < paddedBinaryString.length(); j += 8) {
                String charBinary = paddedBinaryString.substring(j, j + 8);
                int num = Integer.parseInt(charBinary, 2);
                result.append((char) num);
            }
        }

        result.append("}");

        return result.toString();
    }
}
