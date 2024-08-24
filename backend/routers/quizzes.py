from fastapi import APIRouter

router = APIRouter()

# Endpoints
# Create quiz from tags
# Create quic from topic
# Get quizzes
# Get quizz by id
# POST Quiz results


# @router.post("/quizzes/draft", tags=["Quizzes"])
# def draft_quiz(request: Request, db: Session = Depends(get_db)):
#     # quiz_draft_request: QuizDraftRequest,
#     # if quiz_draft_request.type == 'tags':
#     #     return 'ok'
#     # elif quiz_draft_request.type == 'wizard':
#     prompt = "generate questions and answers on the topic of Rome" #+ quiz_draft_request.topic
#     reply = request.app.state.llm_service.chat(prompt)
#     reply = request.app.state.llm_service.get_quiz(reply)


# res  = []
# for problem in reply.problems:
#     reply = request.app.state.llm_service.get_wrong_answers(problem.question, problem.answer)
#     res.append({
#         "question": problem.question,
#         "answer": problem.answer,
#         "wrong1": reply.response1,
#         "wrong2": reply.response2,
#         "wrong3": reply.response3,
#     })


# return res
# else:
#     return 'invalid type'


@router.get("/quizzes/1", tags=["Quizzes"])
def get_quiz():
    return [
        {
            "question": "What is the significance of Rome in history?",
            "answer": "Rome is known for being the center of the powerful Roman Empire, which greatly influenced Western civilization through its advancements in government, engineering, architecture, and culture.",
            "wrong1": "Rome is just a city that had good pasta",
            "wrong2": "Who cares about Rome? Let's talk about my mom instead",
            "wrong3": "Rome? Oh, you mean that place where they used to wear bed sheets and call themselves emperors?",
        },
        {
            "question": "What were the major achievements of the Roman Empire?",
            "answer": "The Roman Empire achieved significant advancements in law, engineering, architecture, literature, and art. They also developed an extensive network of roads, aqueducts, and public buildings.",
            "wrong1": "The Roman Empire invented spaghetti and meatballs, obviously.",
            "wrong2": "The Romans spent most of their time perfecting the art of statue-making. Because, you know, everyone needs a mini-me.",
            "wrong3": "The Roman Empire's greatest achievement was discovering that Caesar salad goes well with a side of betrayal.",
        },
        {
            "question": "What role did Julius Caesar play in Roman history?",
            "answer": "Julius Caesar was a Roman general and statesman who played a pivotal role in the transition of Rome from a republic to an empire. He was assassinated in 44 BC, leading to the rise of his adopted heir, Octavian, who later became Emperor Augustus.",
            "wrong1": "Julius Caesar was a Roman pastry chef who introduced the empire to the world-famous Caesar salad, complete with croutons and parmesan cheese dressing.",
            "wrong2": "Julius Caesar was a Roman hairstylist who invented the iconic 'Caesar haircut' that became a trend among senators and gladiators.",
            "wrong3": "Julius Caesar was a Roman beach bum who spent his days lounging by the Tiber River, sipping on fruity cocktails and watching the boats go by.",
        },
        {
            "question": "What were the main reasons for the fall of the Roman Empire?",
            "answer": "The fall of the Roman Empire was a complex process influenced by factors such as political instability, economic problems, invasions by barbarian tribes, and the division of the empire into eastern and western halves.",
            "wrong1": "The Roman Empire fell because Julius Caesar forgot to pay the barbarians their taxes.",
            "wrong2": "The Roman Empire crumbled because they ran out of pizza and pasta.",
            "wrong3": "The fall of the Roman Empire was caused by Caesar getting distracted by a toga party and forgetting to defend his borders.",
        },
        {
            "question": "What is the legacy of Rome in modern society?",
            "answer": "Rome's legacy can be seen in the architecture, language, legal systems, and governmental structures of modern societies influenced by Roman culture. The Roman Empire's impact on the world is still felt today in various fields such as politics, art, and law.",
            "wrong1": "Rome is famous for inventing pizza before Italy was even a country. So, obviously, the legacy of Rome in modern society is being able to enjoy a delicious slice of pepperoni while watching Netflix.",
            "wrong2": "The legacy of Rome in modern society can be summed up in one word: togas. Yes, because we all know that every modern person wears a toga to work every day and shouts 'Hail Caesar!' before meetings.",
            "wrong3": "Oh, you want to know about Rome's legacy in modern society? Well, it's pretty simple. Rome's legacy is that people still occasionally use the phrase 'When in Rome, do as the Romans do' while completely ignoring what the actual Romans did.",
        },
    ]


#     return [
#   {
#     "question": "What was the foundation myth of Rome?",
#     "answer": "According to legend, Rome was founded in 753 BC by twin brothers Romulus and Remus, who were raised by a she-wolf.",
#     "wrong1": "Rome was founded by Julius Caesar",
#     "wrong2": "Rome was founded by Alexander the Great",
#     "wrong3": "Rome was founded in the Middle Ages by a group of merchants"
#   },
#   {
#     "question": "What were the two main classes in Roman society?",
#     "answer": "The two main classes in Roman society were the patricians, who were wealthy landowners and held most of the political power, and the plebeians, who were common citizens with fewer rights and privileges.",
#     "wrong1": "The two main classes in Roman society were the warriors and the merchants.",
#     "wrong2": "In Roman society, the main classes were the emperors and the slaves.",
#     "wrong3": "The two main classes in Roman society were the priests and the artisans."
#   },
#   {
#     "question": "Who were the famous emperors of Rome?",
#     "answer": "Some of the most famous emperors of Rome include Julius Caesar, Augustus, Nero, and Constantine.",
#     "wrong1": "Genghis Khan was a famous emperor of Rome.",
#     "wrong2": "Cleopatra was a famous emperor of Rome.",
#     "wrong3": "Napoleon Bonaparte was a famous emperor of Rome."
#   },
#   {
#     "question": "What major events led to the fall of the Roman Empire?",
#     "answer": "The fall of the Roman Empire was caused by a combination of factors, including economic troubles, barbarian invasions, political corruption, and the division of the empire into East and West.",
#     "wrong1": "The fall of the Roman Empire was caused by a comet hitting Earth and causing widespread destruction.",
#     "wrong2": "The fall of the Roman Empire was due to a lack of proper communication between the emperors and their advisors.",
#     "wrong3": "The fall of the Roman Empire was caused by a shortage of olives, which led to a decline in olive oil production and trade."
#   },
#   {
#     "question": "What were some of the major contributions of Ancient Rome to Western civilization?",
#     "answer": "Ancient Rome made significant contributions to Western civilization in the areas of law, government, architecture, engineering, art, literature, and philosophy.",
#     "wrong1": "Ancient Rome was known for inventing the telephone and electricity",
#     "wrong2": "The major contributions of Ancient Rome to Western civilization were in the field of space exploration and computer science",
#     "wrong3": "Ancient Rome mainly focused on developing advanced technology like robots and artificial intelligence"
#   },
#   {
#     "question": "What was the significance of the Roman Colosseum?",
#     "answer": "The Roman Colosseum was a massive amphitheater used for gladiatorial contests and other public spectacles, and it symbolized the power and grandeur of the Roman Empire.",
#     "wrong1": "The Roman Colosseum was a temple dedicated to the Roman gods and goddesses.",
#     "wrong2": "The Roman Colosseum was a royal palace for Roman emperors.",
#     "wrong3": "The Roman Colosseum was a library where ancient manuscripts were stored."
#   }
# ]


# @router.get("/tags", response_model=List[TagBase])
# def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     tags = db.query(Tag).all()
#     return tags


# @router.post("/tags", response_model=TagDisplay)
# def get_notes(request: CreateTagRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     new_tag = Tag(name=request.name)
#     db.add(new_tag)
#     db.commit()
#     db.refresh(new_tag)
#     return new_tag
