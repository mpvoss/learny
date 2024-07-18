"""Added diagrams

Revision ID: 3714623c59ec
Revises: b6e7350b6d6a
Create Date: 2024-06-22 18:38:17.053866

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3714623c59ec'
down_revision: Union[str, None] = 'b6e7350b6d6a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('message_diagrams',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('type', sa.String(), nullable=True),
    sa.Column('data', sa.JSON(), nullable=True),
    sa.Column('message_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['message_id'], ['messages.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_message_diagrams_id'), 'message_diagrams', ['id'], unique=False)
    # op.create_unique_constraint(None, 'users', ['id'])


    with op.batch_alter_table("users") as batch_op:
        batch_op.create_unique_constraint('users_unique_id', ['id'])

    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_constraint('users_unique_id', type_='unique')
    op.drop_index(op.f('ix_message_diagrams_id'), table_name='message_diagrams')
    op.drop_table('message_diagrams')
    # ### end Alembic commands ###
