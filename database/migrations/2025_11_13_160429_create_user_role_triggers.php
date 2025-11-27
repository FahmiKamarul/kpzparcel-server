<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations (Create the Triggers).
     */
    public function up(): void
    {
        // =================================================================
        // TRIGGER 1: AFTER INSERT (Handles new staff being added as Manager)
        // =================================================================
        $insertSql = "
            CREATE TRIGGER tr_users_role_insert AFTER INSERT ON users FOR EACH ROW
            BEGIN
                IF NEW.Role = 'Manager' THEN
                    INSERT IGNORE INTO managers (StaffID, AccessExpiryDate)
                    VALUES (NEW.StaffID, DATE_ADD(NOW(), INTERVAL 1 YEAR)); 
                END IF;
            END;
        ";
        DB::unprepared($insertSql);


        // =================================================================
        // TRIGGER 2: AFTER UPDATE (Handles promotion/demotion logic)
        // =================================================================
        $updateSql = "
            CREATE TRIGGER tr_users_role_update AFTER UPDATE ON users FOR EACH ROW
            BEGIN
                IF NEW.Role = 'Manager' AND OLD.Role != 'Manager' THEN
                    INSERT IGNORE INTO managers (StaffID, AccessExpiryDate)
                    VALUES (NEW.StaffID, DATE_ADD(NOW(), INTERVAL 1 YEAR)); 

                ELSEIF OLD.Role = 'Manager' AND NEW.Role != 'Manager' THEN
                    DELETE FROM managers WHERE StaffID = OLD.StaffID;
                END IF;
            END;
        ";
        DB::unprepared($updateSql);
    }

    /**
     * Reverse the migrations (Drop the Triggers).
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS tr_users_role_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS tr_users_role_update');
    }
};