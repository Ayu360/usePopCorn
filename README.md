# usePopcorn Application 
This is a react js project that allows it's users to search and find out about their favorite moveis.
This application was made using: `npx create-react-app`

![Screenshot 2024-07-25 185014](https://github.com/user-attachments/assets/053582ec-7d83-4719-adfe-9de6b49e72ad)


## 📹Demo
[Click here for demo video](https://drive.google.com/file/d/1NifBHZjCH73BIepskxKMJAIF1ZFKsbmG/view?usp=sharing)

## 🏁 Start the app
- Install dependencies: `npm i`

- native application: `npm start`

## ⚙️ Api 
- This application uses the following api to fetch movie data:
```
http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}
```



## 🌟Features
1. Add Your Fav Movies:
   - Create mutable List of Fav Movies along with your own custom rating.
   - Store data in `LOCAL STORGE`, prevents data loss.
   - ![Screenshot 2024-07-25 185951](https://github.com/user-attachments/assets/befcc6d1-c187-4c23-bcdb-80837eeb9da8)


2. Page name set to movie name:
   - Page Name is automatically change to whatever is Movie name.
   - ![Screenshot 2024-07-25 190613](https://github.com/user-attachments/assets/f186e6fa-35ad-49dc-88eb-b686de398950)

3. Aborts the previous query if, new one written fast
   - Usually for aplications if you write:</br>
     a. A</br>
     b. Av</br>
     c. Ave</br>
     d. Aveng</br>
     application calls for result of all 4, but here if Aveng is written before result for Ave appears, all the previous requests will be aborted.
