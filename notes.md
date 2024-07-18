Matthew as a User
- Page load flash thingy
- Pagination
- Chat have URL path thingy
- 

Features
-> Would be cool to go straight to flashcards instead of having to go thru conversation
-----> Maybe on flashcard screen?

//---------------------------------

RAG
- How to do more than Q&A on a doc? Extracting summaries etc?
- Upload button has progress, closes itself, refreshes list
- Request routing logic in chat screen about doc vs free form target
- Backend update to integrate RAG on new endpoint

//-------------------------
Quiz TODO
- Create data models in DB
- Create Wizard in UI, tag vs generated
- Save Quizzes to DB after wizard
- Quiz taking is dynamic on selection
- Save quiz results to DB

ans
w1
w2
w3

o1, o2, o3, o4
correct=3
scatter when display
know which nbr


Quiz from FC deck
Generated quiz free form

Data models
  Quiz
    id
    name
  QuizItem -- how to support jumbled? Grade on server ofc.
    id
    quiz_id
    question
    options
    answer_id
  QuizResults
    id
    quiz_id
    score


//-------------------------
Easy deploy design
docker image
 - react files served on one port
 - fast api on another port
 - sqllite db?

docker compose
- supabase (auth + postgres)
- fastapi with static files

docker steps
- Want supabase to come up. Check it's happy
- Then can try to turn on learny and talk to db
- Then can test react -> learny -> db

Let's take a few steps back
- Docker != docker compose
- Like...if we're distributing this with docker compose then 
- I think I'll have a sep folder
- Clone project, cd in, run docker-compose-up
There's just one image I'll put on dockerhub and then it's free
supabase is there already




//-------------------------
MVP
- App should be user-sensitive (different data for different users)
- chat url to save path and refresh
- Timeline -> give min width and scroll
- Timeline editing
- Diagrams screen? Able to save from chat
- initial page load bug
- Code Cleanup
- Help pop up for Study screen, explain ANKII spaced repitition
- legit 404 page
- AUDIT ALL ENDPOITNS FOR AUTH DEPENDENCY PROGRAMMATICALLY
- Readme with diagrams
- Video demo

Demo Wish list
- Quiz generation...
- ELI5 mode
- Message pagination
- Stand up test env
- Notes, Flashcards...CRUD, Edit button, delete button, ADD workflow
- Socratic mode... Questions generated after each response? 
- Want to show timeline, ability to save and review later
- Question suggester, concept map, timeline, make flash cards, use them
- Save notes, edit
- Perspective enhancer question maker 
- Perspective enhancer - user gives their understanding and AI can give feedback
- Force diagram with concepts - let it imagine the names of lines, then draw them for arbitraty concept maps


image support for ankii cards
https://github.com/kerrickstaley/genanki?tab=readme-ov-file#media-files


Tutorial
https://github.com/dair-ai/Prompt-Engineering-Guide
https://github.com/f/awesome-chatgpt-prompts



# Cloud architecture
Need to evaluate a few different models and compare performance vs cost
5. https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard
6. Maybe track the tokens used by each user, model, cost per etc. DIY
7. Steal features from : https://portkey.ai/features/observability
8. gpt 3.5 turbo, 4 omni price compare and feature compare
https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-static-website-terraform?tabs=azure-cli
9. https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_function_app


## DB commands
Might need this first
`export ENV=PROD`

Create migration 

`alembic revision --autogenerate -m "Initial migration"`  

Run it

`alembic upgrade head`


# Check size of deps
du -sh * | sort -h


https://pashpashpash.substack.com/p/tackling-the-challenge-of-document
https://pashpashpash.substack.com/p/understanding-long-documents-with

| --- | --- | --- |
| --- | --- | --- |
| Cell 1 | Cell 2 | Cell 3 |  
| Cell 4 | Cell 5 | Cell 6 |

providing context based on the drill down seems important

could do that via a cache...but langchain probably has a better way
