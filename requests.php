<?php
error_reporting(0);

$file = __DIR__ . '/requests.txt';

/* ---------- действия ---------- */
if (isset($_GET['clear'])) {
    file_put_contents($file, '');
    header("Location: requests.php");
    exit;
}

if (isset($_GET['delete'])) {

    $id = (int)$_GET['delete'];

    if (file_exists($file)) {
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $lines = array_reverse($lines);

        if (isset($lines[$id])) {
            unset($lines[$id]);
        }

        $lines = array_reverse(array_values($lines));

        if (count($lines)) {
            file_put_contents($file, implode(PHP_EOL, $lines) . PHP_EOL);
        } else {
            file_put_contents($file, '');
        }
    }

    header("Location: requests.php");
    exit;
}

/* ---------- чтение файла ---------- */
$rows = [];

if (file_exists($file)) {

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $lines = array_reverse($lines);

    foreach ($lines as $i => $line) {

        $parts = explode(" | ", $line, 5);

        $rows[] = [
            "id"      => $i,
            "date"    => $parts[0] ?? '',
            "name"    => $parts[1] ?? '',
            "email"   => $parts[2] ?? '',
            "phone"   => $parts[3] ?? '',
            "message" => $parts[4] ?? ''
        ];
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Заявки</title>

<style>
body{
    margin:0;
    padding:30px;
    font-family:Arial,sans-serif;
    background:#f8fafc;
}
h1{
    margin-bottom:20px;
}
.top{
    margin-bottom:20px;
}
button,a.btn{
    border:none;
    padding:10px 16px;
    border-radius:10px;
    cursor:pointer;
    color:#fff;
    text-decoration:none;
    display:inline-block;
}
.clear{ background:#dc2626; }
.del{ background:#ef4444; padding:8px 12px; }

table{
    width:100%;
    border-collapse:collapse;
    background:#fff;
}
th{
    background:#111827;
    color:#fff;
    padding:12px;
    text-align:left;
}
td{
    border:1px solid #ddd;
    padding:10px;
    vertical-align:top;
}
tr:hover{
    background:#f9fafb;
}
.empty{
    background:#fff;
    padding:30px;
}
</style>
</head>
<body>

<h1>Заявки</h1>

<div class="top">
<a class="btn clear"
   href="requests.php?clear=1"
   onclick="return confirm('Удалить все заявки?')">
   Очистить все заявки
</a>
</div>

<?php if(count($rows)): ?>

<table>
<tr>
<th>Дата</th>
<th>Имя</th>
<th>Email</th>
<th>Телефон</th>
<th>Сообщение</th>
<th>Удалить</th>
</tr>

<?php foreach($rows as $row): ?>
<tr>
<td><?= htmlspecialchars($row['date']) ?></td>
<td><?= htmlspecialchars($row['name']) ?></td>
<td><?= htmlspecialchars($row['email']) ?></td>
<td><?= htmlspecialchars($row['phone']) ?></td>
<td><?= htmlspecialchars($row['message']) ?></td>
<td>
<a class="btn del"
   href="requests.php?delete=<?= $row['id'] ?>"
   onclick="return confirm('Удалить заявку?')">
   Удалить
</a>
</td>
</tr>
<?php endforeach; ?>

</table>

<?php else: ?>

<div class="empty">Заявок нет</div>

<?php endif; ?>

</body>
</html>