以下のエラーにより、DB操作ができない。
新規登録時
CreateCategoryModal.tsx:87 
 POST http://localhost:3000/api/categories 405 (Method Not Allowed)

更新時
CreateCategoryModal.tsx:85 
 PUT http://localhost:3000/api/categories/C00000002 404 (Not Found)
handleSubmit	@	CreateCategoryModal.tsx:85


削除時
page.tsx:53 
 DELETE http://localhost:3000/api/categories/C00000002 404 (Not Found)
handleDelete	@	page.tsx:53
onClick	@	page.tsx:143