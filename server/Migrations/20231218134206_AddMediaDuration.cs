using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Transcribey.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Duration",
                table: "Medias",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Medias");
        }
    }
}
