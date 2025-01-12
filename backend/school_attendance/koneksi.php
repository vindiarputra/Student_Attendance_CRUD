<?php
header("Access-Control-Allow-Origin: *");  // Allow all origins (gunakan origin yang spesifik di produksi)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Database connection
$conn = new mysqli("localhost", "root", "", "school_attendance");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => 0, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get the HTTP request method
$method = $_SERVER['REQUEST_METHOD'];

// Process based on request method
switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM attendance";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $attendanceRecords = [];
            while ($row = $result->fetch_assoc()) {
                $attendanceRecords[] = $row;
            }
            echo json_encode(["status" => 1, "data" => $attendanceRecords]);
        } else {
            echo json_encode(["status" => 1, "message" => "No records found."]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['student_name']) || empty($data['status']) || empty($data['date'])) {
            http_response_code(400);
            echo json_encode(["status" => 0, "message" => "Invalid input. All fields are required."]);
            exit();
        }

        $sql = "INSERT INTO attendance (student_name, status, date) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $data['student_name'], $data['status'], $data['date']);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["status" => 1, "message" => "Record created successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => 0, "message" => "Failed to create record."]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id']) || empty($data['student_name']) || empty($data['status']) || empty($data['date'])) {
            http_response_code(400);
            echo json_encode(["status" => 0, "message" => "Invalid input. All fields are required."]);
            exit();
        }

        $sql = "UPDATE attendance SET student_name=?, status=?, date=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $data['student_name'], $data['status'], $data['date'], $data['id']);

        if ($stmt->execute()) {
            echo json_encode(["status" => 1, "message" => "Record updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => 0, "message" => "Failed to update record."]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["status" => 0, "message" => "Invalid input. ID is required."]);
            exit();
        }

        $sql = "DELETE FROM attendance WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $data['id']);

        if ($stmt->execute()) {
            echo json_encode(["status" => 1, "message" => "Record deleted successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => 0, "message" => "Failed to delete record."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => 0, "message" => "Method not allowed."]);
        break;
}

// Close the database connection
$conn->close();
?>
