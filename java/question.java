import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Stack;

public class question {
    public static void main(String[] args) {
        // boolean res = is132Pattern(new int[] { -1, 3, 2, 0 });
        // System.out.println(res);

        // int[] res = new Solution().nextGreaterElement(new int[] { 1, 2, 1 });
        // for (int num : res) {
        // System.out.print(num + " ");
        // }

        int[][] merged = new Solution().mergeInterval(new int[][] { { 1, 3 }, { 2, 6 }, { 8, 10 }, { 15, 18 } });
        for (int[] interval : merged) {
            System.out.println(Arrays.toString(interval));
        }
    }

    public static boolean is132Pattern(int[] arr) {
        Stack<Integer> s = new Stack<>();
        int numk = Integer.MIN_VALUE;

        for (int i = arr.length - 1; i >= 0; i--) {
            if (arr[i] < numk) {
                return true;
            }
            while (!s.isEmpty() && s.peek() < arr[i]) {
                numk = s.pop();
            }
            s.push(arr[i]);
        }
        return false;
    }
}

class Solution {

    public int[] nextGreaterElement(int[] nums1) {
        Stack<Integer> stack = new Stack<>();
        int res[] = new int[nums1.length];
        int n = nums1.length;

        for (int i = 2 * n - 1; i >= 0; i--) {
            int realIdx = i % n;

            while (!stack.isEmpty() && nums1[stack.peek()] <= nums1[realIdx]) {
                stack.pop();
            }

            if (i < n) {
                if (!stack.isEmpty()) {
                    res[realIdx] = nums1[stack.peek()]; // Use stack.peek() instead of array syntax
                } else {
                    res[realIdx] = -1; // Default if no greater element exists
                }
            }
            stack.push(realIdx);
        }

        return res;
    }

    public int[][] mergeInterval(int[][] interval) {

        if (interval == null || interval.length <= 1) {
            return interval;
        }

        Arrays.sort(interval, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int[] currentInterval = interval[0];
        merged.add(currentInterval);

        for (int i = 1; i < interval.length; i++) {
            int[] nextInterval = interval[i];

            int currentEnd = currentInterval[1];
            int nextStart = nextInterval[0];
            int nextEnd = nextInterval[1];

            if (nextStart <= currentEnd) {
                currentInterval[1] = Math.max(currentEnd, nextEnd);
            } else {
                currentInterval = nextInterval;
                merged.add(currentInterval);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }

    // Grumpy Bookstore Owner
    // customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3

}