import config.SupabaseConfig;
import api.SupabaseClient;

public class test_supabase_connection {
    public static void main(String[] args) {
        System.out.println("Testing Supabase connection...");
        System.out.println("URL: " + SupabaseConfig.SUPABASE_URL);
        System.out.println("Endpoint: " + SupabaseConfig.DISHES_ENDPOINT);
        
        SupabaseClient client = new SupabaseClient();
        boolean connected = client.testConnection();
        System.out.println("Connection test: " + (connected ? "SUCCESS" : "FAILED"));
        
        if (connected) {
            try {
                System.out.println("Fetching dishes...");
                var dishes = client.getAllDishes();
                System.out.println("Found " + dishes.size() + " dishes");
                for (var dish : dishes) {
                    System.out.println("- " + dish.getDishId() + ": " + dish.getName() + " (" + dish.getType() + ")");
                }
            } catch (Exception e) {
                System.out.println("Error fetching dishes: " + e.getMessage());
            }
        }
    }
}
