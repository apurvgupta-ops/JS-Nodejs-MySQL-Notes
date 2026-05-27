package DesignPatterns;

import java.util.ArrayList;
import java.util.List;

interface ISubscriber {
    void update();
}

interface IChannel {
    void subscribe(ISubscriber subscriber);

    void unsubscribe(ISubscriber subscriber);

    void notifySubscribers();
}

class YouTubeChannel implements IChannel {
    private List<ISubscriber> subscribers = new ArrayList<>();
    private String name;
    private String latestVideo;

    public YouTubeChannel(String name) {
        System.out.println("YouTube Channel created: " + name);
        this.name = name;
        this.subscribers = new ArrayList<>();
    }

    @Override
    public void subscribe(ISubscriber subscriber) {
        if (!subscribers.contains(subscriber)) {
            System.out.println("Subscriber added: " + subscriber);
        } else {
            System.out.println("Subscriber already exists: " + subscriber);
        }
        subscribers.add(subscriber);
    }

    @Override
    public void unsubscribe(ISubscriber subscriber) {
        subscribers.remove(subscriber);
    }

    @Override
    public void notifySubscribers() {
        for (ISubscriber subscriber : subscribers) {
            subscriber.update();
        }
    }

    public void uploadVideo(String videoTitle) {
        this.latestVideo = videoTitle;
        System.out.println("New video uploaded: " + videoTitle);
        notifySubscribers();
    }
}

class Subscriber implements ISubscriber {
    private String name;

    public Subscriber(String name) {
        this.name = name;
    }

    @Override
    public void update() {
        System.out.println(name + " received notification of new video.");
    }

    @Override
    public String toString() {
        return name;
    }
}

public class ObserverDesignPattern {

    public static void main(String[] args) {
        // IChannel channel = new YouTubeChannel("Tech Reviews");
        YouTubeChannel channel = new YouTubeChannel("Tech Reviews");

        ISubscriber subscriber1 = new Subscriber("Alice");
        ISubscriber subscriber2 = new Subscriber("Bob");
        ISubscriber subscriber3 = new Subscriber("Charlie");

        channel.subscribe(subscriber1);
        channel.subscribe(subscriber2);
        channel.subscribe(subscriber3);

        channel.uploadVideo("Java Design Patterns Explained");
    }

}
