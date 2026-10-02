export default function buatLevel1({
    ground,
    platform,
    collectible,
    enemy,
    goal,
    decoration
}) {
    ground(0, 650, 2200);

    platform(50, 530, 180);
    platform(250, 530, 180);
    platform(500, 440, 170);
    platform(760, 520, 180);
    platform(1010, 410, 180);
    platform(1280, 500, 180);
    platform(1530, 390, 180);
    platform(1780, 500, 180);
    platform(1980, 380, 160);

    collectible("star", 310, 475);
    collectible("star", 550, 385);
    collectible("star", 820, 465);
    collectible("star", 1060, 355);
    collectible("star", 1340, 445);
    collectible("star", 1590, 335);
    collectible("star", 1840, 445);

    collectible("diamond", 580, 370);
    collectible("diamond", 1090, 340);
    collectible("diamond", 1610, 320);

    enemy(700, 608);
    enemy(1170, 608);
    enemy(1480, 608);
    enemy(1730, 608);

    goal(2040, 300);
    decoration();
}