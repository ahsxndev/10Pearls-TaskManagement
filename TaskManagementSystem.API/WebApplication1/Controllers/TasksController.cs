using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.API.Data;
using TaskManagementSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Serilog; // 👈 1. Added Serilog

namespace TaskManagementSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim) : 0;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var emailClaim = User.FindFirstValue(ClaimTypes.Email); // Read the email from the token

            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim);

            // If the logged-in user is the admin, return EVERYTHING
            if (emailClaim == "admin@admin.com")
            {
                Log.Information("ADMIN ACCESS: Showing all tasks in the system.");
                return await _context.Tasks.ToListAsync();
            }

            // Otherwise, standard user behavior (only show their own tasks)
            Log.Information("User {UserId} is fetching their tasks.", userId);
            return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            int userId = GetUserId();
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null)
            {
                Log.Warning("User {UserId} tried to access non-existent or unauthorized Task {TaskId}", userId, id);
                return NotFound("Task not found.");
            }

            return task;
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            task.UserId = GetUserId();

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // 👈 2. Professional Logging
            Log.Information("SUCCESS: Task '{Title}' created by User {UserId}", task.Title, task.UserId);

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem task)
        {
            int userId = GetUserId();
            if (id != task.Id) return BadRequest();

            var existingTask = await _context.Tasks.AnyAsync(t => t.Id == id && t.UserId == userId);
            if (!existingTask)
            {
                Log.Error("SECURITY ALERT: User {UserId} attempted to modify Task {TaskId} without ownership.", userId, id);
                return Unauthorized();
            }

            task.UserId = userId;
            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            Log.Information("Task {TaskId} updated by User {UserId}", id, userId);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            int userId = GetUserId();
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            Log.Warning("Task {TaskId} DELETED by User {UserId}", id, userId);

            return NoContent();
        }
    }
}