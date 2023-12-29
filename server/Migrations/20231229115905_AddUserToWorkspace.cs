using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Transcribey.Migrations
{
    /// <inheritdoc />
    public partial class AddUserToWorkspace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Workspaces",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_AppUserId",
                table: "Workspaces",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workspaces_AspNetUsers_AppUserId",
                table: "Workspaces",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workspaces_AspNetUsers_AppUserId",
                table: "Workspaces");

            migrationBuilder.DropIndex(
                name: "IX_Workspaces_AppUserId",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Workspaces");
        }
    }
}
