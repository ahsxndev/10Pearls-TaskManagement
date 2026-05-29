using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManagementSystem.API.Controllers;
using TaskManagementSystem.API.Data;
using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.Tests
{
    public class TasksControllerTests
    {
        // Helper method to generate a fresh, empty fake database for each test
        private AppDbContext GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var databaseContext = new AppDbContext(options);
            databaseContext.Database.EnsureCreated();
            return databaseContext;
        }

        [Fact]
        public async Task GetTasks_ReturnsOnlyLoggedInUserTasks()
        {
            // 1. ARRANGE: Set up the fake database and the controller
            var dbContext = GetDatabaseContext();

            // Add one task for User 1, and one task for User 2
            dbContext.Tasks.Add(new TaskItem { Id = 1, Title = "Ahsan's Task", UserId = 1 });
            dbContext.Tasks.Add(new TaskItem { Id = 2, Title = "Someone Else's Task", UserId = 2 });
            await dbContext.SaveChangesAsync();

            var controller = new TasksController(dbContext);

            // Simulate a logged-in user with a JWT token (User ID = 1)
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Email, "test@test.com")
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // 2. ACT: Call the GetTasks endpoint
            var result = await controller.GetTasks();

            // 3. ASSERT: Verify the result is exactly what we expect
            var actionResult = Assert.IsType<ActionResult<IEnumerable<TaskItem>>>(result);
            var tasks = Assert.IsAssignableFrom<IEnumerable<TaskItem>>(actionResult.Value);

            // Prove that the Bouncer worked: User 1 should only get 1 task back
            Assert.Single(tasks);
            Assert.Equal("Ahsan's Task", tasks.First().Title);
        }
    }
}