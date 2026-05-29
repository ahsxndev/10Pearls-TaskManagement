namespace TaskManagementSystem.API.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // We NEVER save plain text passwords (like "password123"). 
        // We will hash them into scrambled text later for security.
        public string PasswordHash { get; set; } = string.Empty;

        // This will let us distinguish between a regular "User" and an "Admin"
        public string Role { get; set; } = "User";
    }
}