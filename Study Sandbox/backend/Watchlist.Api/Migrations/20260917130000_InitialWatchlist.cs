using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Watchlist.Api.Migrations;

public partial class InitialWatchlist : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "watchlist_items",
            columns: table => new
            {
                user_id = table.Column<Guid>(type: "uuid", nullable: false),
                content_id = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                added_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_watchlist_items", x => new { x.user_id, x.content_id });
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "watchlist_items");
    }
}
