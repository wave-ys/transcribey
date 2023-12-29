using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;
using Transcribey.Models;
using Transcribey.Utils;

namespace Transcribey.Controllers;

[Route("[controller]")]
[ApiController]
public class WorkspaceController : ControllerBase
{
    private readonly DataContext _context;

    private readonly IObjectStorage _objectStorage;

    public WorkspaceController(DataContext context, IObjectStorage objectStorage)
    {
        _context = context;
        _objectStorage = objectStorage;
    }

    // GET: api/Workspace
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Workspace>>> GetWorkspaces()
    {
        var user = await HttpContext.GetUserAsync();
        return await _context.Workspaces.Where(w => w.AppUserId == user!.Id).ToListAsync();
    }

    // GET: api/Workspace/5
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Workspace>> GetWorkspace(long id)
    {
        var user = await HttpContext.GetUserAsync();
        var workspace = await _context.Workspaces.Where(w => w.AppUserId == user!.Id)
            .SingleOrDefaultAsync(w => w.Id == id);

        if (workspace == null) return NotFound();

        return workspace;
    }

    // PUT: api/Workspace/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutWorkspace(long id, Workspace workspace)
    {
        if (id != workspace.Id) return BadRequest();
        var user = await HttpContext.GetUserAsync();
        if (!await _context.Workspaces.Where(w => w.AppUserId == user!.Id && w.Id == id).AnyAsync())
            return BadRequest();

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
    [Authorize]
    public async Task<ActionResult<Workspace>> PostWorkspace(Workspace workspace)
    {
        var user = await HttpContext.GetUserAsync();
        workspace.AppUserId = user!.Id;
        _context.Workspaces.Add(workspace);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetWorkspace", new { id = workspace.Id }, workspace);
    }

    // DELETE: api/Workspace/5
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteWorkspace(long id)
    {
        var user = await HttpContext.GetUserAsync();
        var workspace = await _context.Workspaces.Where(w => w.AppUserId == user!.Id)
            .SingleOrDefaultAsync(w => w.Id == id);
        if (workspace == null) return NotFound();

        var medias = await _context.Medias.Where(m => m.WorkspaceId == id).AsNoTracking().ToListAsync();
        await _objectStorage.RemoveFiles(medias
            .SelectMany(m => new List<string> { m.ResultPath, m.StorePath, m.ThumbnailPath })
            .Where(s => !string.IsNullOrEmpty(s)).ToList());

        await _context.Workspaces.Where(m => m.Id == id).ExecuteDeleteAsync();
        return NoContent();
    }

    private bool WorkspaceExists(long id)
    {
        return _context.Workspaces.Any(e => e.Id == id);
    }
}