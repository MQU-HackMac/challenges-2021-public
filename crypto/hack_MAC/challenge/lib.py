from dataclasses import dataclass
from typing import List

MAX_VACCINES = 10


@dataclass
class Vaccine:
    name: str
    experimental: bool


vaccines = [
    Vaccine(name='Moderna', experimental=False),
    Vaccine(name='MQU', experimental=False),
    Vaccine(name='Phizer', experimental=False),
    Vaccine(name='Astra Zeneca', experimental=False)
]

with open('./flag.txt', 'r') as f:
    vaccines.append(Vaccine(name='Mr. Ping Juice', experimental=True))
    vaccines.append(Vaccine(name='Bin Chicken Essence', experimental=True))
    vaccines.append(Vaccine(name='Mountain Dew', experimental=True))
    vaccines.append(Vaccine(name=f.read(), experimental=True))


def get_vaccines() -> List[Vaccine]:
    """Get a list of all non experimental Vaccines

    returns:
        List[Vaccine]: List of Vaccines
    """
    return [x for x in vaccines if not x.experimental]


def add_vaccine(name: str) -> bool:
    """Add a vaccine
    A maximum of MAX_VACCINES is allowed

    Args:
        name (str): The name of the vaccine to add

    Returns:
        bool: True if the vaccine was sucessfuly added
    """
    if len(vaccines) >= MAX_VACCINES:
        return False

    vaccines.append(Vaccine(name=name, experimental=False))
    return True


def remove_vaccine(name: str) -> bool:
    """Remove a vaccine by name

    Args:
        name (str): The name of the vaccine to remove

    Returns:
        bool: True if the vaccine was successfuly removed
    """
    for vaccine in vaccines:
        if vaccine.name == name:
            vaccines.remove(vaccine)
            return True

    return False


def get_prototypes() -> List[Vaccine]:
    """Get a list of all experimental Vaccines

    returns:
        list[Vaccine]: List of Vaccines
    """
    return [x for x in vaccines if x.experimental]
