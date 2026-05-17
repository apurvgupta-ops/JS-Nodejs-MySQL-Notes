
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ques {

    static void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }

    // ─── PROBLEM 1: 3Sum ───────────────────────────────────────────
    static List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            int left = i + 1, right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }
                    left++;
                    right--;
                } else if (sum > 0) {
                    right--;
                } else {
                    left++;
                }
            }
        }
        return result;
    }

    // ─── PROBLEM 2: Container With Most Water ──────────────────────
    static int containerWithMostWater(int[] heights) {
        int maxwater = 0;
        int left = 0;
        int right = heights.length - 1;

        while (left < right) {

            int minHeight = Math.min(heights[left], heights[right]);
            int breadth = right - left;
            int area = minHeight * breadth;

            if (heights[left] < heights[right]) {
                left++;
            } else {
                right--;
            }
            maxwater = Math.max(maxwater, area);
        }
        return maxwater;
    }

    // ─── PROBLEM 3: Sort Colors ──────────────────────
    static void sortColors(int[] nums) {
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums, low, mid);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                swap(nums, mid, high);
                high--;
            }
        }
    }

    // ─── PROBLEM 4: Sort Colors ──────────────────────
    // ─── TEST RUNNER ───────────────────────────────────────────────
    public static void main(String[] args) {
        // 3Sum
        // int[] nums = {-1, 0, 1, 2, -1, -4};
        // System.out.println("3Sum: " + threeSum(nums));

        // ---------------
        // Container With Most Water
        // int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        // System.out.println("Container Most Water: " +
        // containerWithMostWater(heights));
        // ---------------
        // Sort Colors
        // int[] nums = {2, 0, 2, 1, 1, 0};
        // sortColors(nums);
        // System.out.println(Arrays.toString(nums));
    }
}
