using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Transcribey.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToMediaType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Failed",
                table: "Medias",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "FailedReason",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Medias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Failed",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "FailedReason",
                table: "Medias");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Medias");
        }
    }
}
