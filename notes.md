
features for fc home page
- Export would be cool
- Study button needed
- Edit seems imp


Pri1
- close speed dial after button click
- Make a new favicon
- User sensitive features....
- Fix docker and setup for wes
- Share proj to reddit
- Finish setting up discord, reference it in readme
- Record demo video
- PROD VS TEST DB...local db for test bro, prod is supabase
- Pankaj demo
Pri2
- Chat context...last 2 or 3 messages



Permission stuff....
- I think Group access is gonna be a thing
- This can be implemented via creating groups, adding users to groups, and each resource having group associations
- If you're ina  group which is associated with a resource, you have access
- That way you can share your tag with a group you're in, they get all your flashcards. Not true for chats ofc
- Everything still has an owner. 
WTF FLASHCARD STATUS LOL....needs to be denormalized I guess
That will come later
The point is that RLS might interfere with the other features
Like, it's a committment
Don't want to code it that way until I know more about requirements
Easy to put stuff in app logic now and modify later if a clear way to simply is found



Matthew as a User
- Pagination
- FC
  - Not paginated
  - Drop down + study button ugly, lookup stuff to steal for UI
  - Change design of page? list of cards with answers not that helpful...maybe pick a category and it tells you how many are there and due for study?? 

//---------------------------------

Using flashcards from learny
-> Ability to import from my sheet...or at least sync
- Can do that with python
two way sync bro


First users
- Wes friend
- Sam's wife
- Megan (wes roomate)
- Wes
- ???

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
MVP
- Timeline -> give min width and scroll
- Timeline editing
- Diagrams screen? Able to save from chat
- Code Cleanup
- Help pop up for Study screen, explain ANKII spaced repitition
- legit 404 page
- AUDIT ALL ENDPOITNS FOR AUTH DEPENDENCY PROGRAMMATICALLY
- Readme with diagrams

Demo Wish list
- Quiz generation...
- ELI5 mode
- Message pagination
- Ability to generate flashcards from the Flashcard screen in addition to Chat screen
- Stand up test env
- Notes, Flashcards...CRUD, Edit button, delete button, ADD workflow
- Socratic mode... Questions generated after each response? 
- Want to show timeline, ability to save and review later
- Question suggester, concept map, timeline, make flash cards, use them
- Save notes, edit
- Perspective enhancer question maker 
- Perspective enhancer - user gives their understanding and AI can give feedback
- Force diagram with concepts - let it imagine the names of lines, then draw them for arbitraty concept maps
- GIVE USER ABILITY TO MODIFY ALL PROMPTS???? that would be swag

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

`alembic revision --autogenerate -m "001_Initial migration"`  

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


# Gotta run pytest with python path and env set...
PYTHONPATH=/home/mpvoss/Cloud/learny/backend ENV=PYTEST pytest

simplescreenrecorder