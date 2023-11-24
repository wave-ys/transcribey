using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Transcribey.Migrations
{
    /// <inheritdoc />
    public partial class AddPrefaceToMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Preface",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Preface",
                table: "Medias");
        }
    }
}
