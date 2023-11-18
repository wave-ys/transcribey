using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;
using Transcribey.Models;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WorkspaceController : ControllerBase
{
    private readonly DataContext _context;

    public WorkspaceController(DataContext context)
    {
        _context = context;
    }

    // GET: api/Workspace
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Workspace>>> GetWorkspaces()
    {
        return await _context.Workspaces.ToListAsync();
    }

    // GET: api/Workspace/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Workspace>> GetWorkspace(long id)
    {
        var workspace = await _context.Workspaces.FindAsync(id);

        if (workspace == null) return NotFound();

        return workspace;
    }

    // PUT: api/Workspace/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutWorkspace(long id, Workspace workspace)
    {
        if (id != workspace.Id) return BadRequest();

        _context.Entry(workspace).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!WorkspaceExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // POST: api/Workspace
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Workspace>> PostWorkspace(Workspace workspace)
    {
        _context.Workspaces.Add(workspace);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetWorkspace", new { id = workspace.Id }, workspace);
    }

    // DELETE: api/Workspace/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkspace(long id)
    {
        var workspace = await _context.Workspaces.FindAsync(id);
        if (workspace == null) return NotFound();

        _context.Workspaces.Remove(workspace);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool WorkspaceExists(long id)
    {
        return _context.Workspaces.Any(e => e.Id == id);
    }
}