using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Transcribey.Migrations
{
    /// <inheritdoc />
    public partial class AddLanguageAndModelToMediaType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Model",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "Model",
                table: "Medias");
        }
    }
}
